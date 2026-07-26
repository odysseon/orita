import { Injectable, Injector, afterNextRender, effect, inject, signal, DestroyRef } from '@angular/core';

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';
export type AnchorAlign = 'start' | 'center' | 'end';
export type AnchorPlacement = `${AnchorSide}-${AnchorAlign}`;

export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  offset: number;
  viewportPadding: number;
  /** Injectable for tests; defaults to the real viewport at call time. */
  viewportWidth?: number;
  viewportHeight?: number;
}

export interface AnchorPosition {
  top: number;
  left: number;
  /** May differ from the requested placement if a flip occurred. */
  resolvedPlacement: AnchorPlacement;
}

const OPPOSITE: Record<AnchorSide, AnchorSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export function computePosition(
  triggerRect: Rect,
  overlayRect: Rect,
  placement: AnchorPlacement,
  options: ComputePositionOptions,
): AnchorPosition {
  const viewportWidth = options.viewportWidth ?? window.innerWidth;
  const viewportHeight = options.viewportHeight ?? window.innerHeight;
  const { offset, viewportPadding } = options;

  const [side, align] = placement.split('-') as [AnchorSide, AnchorAlign];

  const fitsSide = (s: AnchorSide): boolean => {
    switch (s) {
      case 'top':
        return triggerRect.top - overlayRect.height - offset >= viewportPadding;
      case 'bottom':
        return triggerRect.bottom + overlayRect.height + offset <= viewportHeight - viewportPadding;
      case 'left':
        return triggerRect.left - overlayRect.width - offset >= viewportPadding;
      case 'right':
        return triggerRect.right + overlayRect.width + offset <= viewportWidth - viewportPadding;
    }
  };

  // Flip only if the preferred side doesn't fit AND the opposite side actually does —
  // otherwise you can flip-flop between two sides that both overflow (e.g. overlay taller than viewport).
  const resolvedSide = fitsSide(side) || !fitsSide(OPPOSITE[side]) ? side : OPPOSITE[side];

  let top: number | undefined;
  let left: number | undefined;

  // -- Main axis: position flush against the trigger on the resolved side --
  if (resolvedSide === 'top') {
    top = triggerRect.top - overlayRect.height - offset;
  } else if (resolvedSide === 'bottom') {
    top = triggerRect.bottom + offset;
  } else if (resolvedSide === 'left') {
    left = triggerRect.left - overlayRect.width - offset;
  } else {
    left = triggerRect.right + offset;
  }

  // -- Cross axis: align start/center/end relative to the trigger --
  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    if (align === 'start') left = triggerRect.left;
    else if (align === 'end') left = triggerRect.right - overlayRect.width;
    else left = triggerRect.left + triggerRect.width / 2 - overlayRect.width / 2;
  } else {
    if (align === 'start') top = triggerRect.top;
    else if (align === 'end') top = triggerRect.bottom - overlayRect.height;
    else top = triggerRect.top + triggerRect.height / 2 - overlayRect.height / 2;
  }

  // -- Clamp cross axis into the viewport (shift, never flip the cross axis) --
  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    left = clamp(left!, viewportPadding, viewportWidth - overlayRect.width - viewportPadding);
  } else {
    top = clamp(top!, viewportPadding, viewportHeight - overlayRect.height - viewportPadding);
  }

  return {
    top: top!,
    left: left!,
    resolvedPlacement: `${resolvedSide}-${align}`,
  };
}

function clamp(value: number, min: number, max: number): number {
  // Overlay wider/taller than the available space: min > max. Pin to min (viewport edge)
  // rather than let Math.min/max invert and push it off-screen the other way.
  if (max < min) return min;
  return Math.max(min, Math.min(value, max));
}

export interface AnchorPositionConfig {
  /** The element the overlay is anchored to. */
  trigger: () => HTMLElement | null;
  /** The overlay element itself — measured for collision detection. Must already be in the DOM (hidden) when isOpen() is true. */
  overlay: () => HTMLElement | null;
  placement: () => AnchorPlacement;
  isOpen: () => boolean;
  /** Gap between trigger and overlay, in px. Default 4. */
  offset?: number;
  /** Minimum distance from viewport edge before flip/shift kicks in. Default 8. */
  viewportPadding?: number;
}

@Injectable()
export class AnchorPositionService {
  private readonly injector = inject(Injector);
  private config!: AnchorPositionConfig;
  private initialized = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detach());
  }

  /** Null when closed, no trigger, or overlay not yet measurable. */
  readonly position = signal<AnchorPosition | null>(null);

  /** False when the trigger has scrolled out of view or been removed while open. */
  readonly triggerVisible = signal<boolean>(true);

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private scrollListener?: () => void;

  init(config: AnchorPositionConfig): void {
    if (this.initialized) {
      throw new Error('AnchorPositionService.init() can only be called once per instance.');
    }
    this.initialized = true;
    this.config = { offset: 4, viewportPadding: 8, ...config };

    effect(
      () => {
        if (this.config.isOpen()) {
          this.attach();
        } else {
          this.detach();
        }
      },
      { injector: this.injector }
    );
  }

  /** Call after the overlay's content changes size while open (e.g. a menu item list changes). */
  recompute(): void {
    this.updatePosition();
  }

  private attach(): void {
    afterNextRender(
      () => {
        this.updatePosition();
        this.observeTriggerVisibility();
        this.observeOverlayResize();
        this.scrollListener = () => this.updatePosition();
        window.addEventListener('scroll', this.scrollListener, { capture: true, passive: true });
        window.addEventListener('resize', this.scrollListener);
      },
      { injector: this.injector }
    );
  }

  private detach(): void {
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, { capture: true });
      window.removeEventListener('resize', this.scrollListener);
    }
    this.position.set(null);
    this.triggerVisible.set(true);
  }

  private updatePosition(): void {
    const trigger = this.config.trigger();
    const overlay = this.config.overlay();
    if (!trigger || !overlay) return;

    const triggerRect = trigger.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    
    this.position.set(
      computePosition(triggerRect, overlayRect, this.config.placement(), {
        offset: this.config.offset!,
        viewportPadding: this.config.viewportPadding!,
      })
    );
  }

  private observeTriggerVisibility(): void {
    const trigger = this.config.trigger();
    if (!trigger) return;
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.triggerVisible.set(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    this.intersectionObserver.observe(trigger);
  }

  private observeOverlayResize(): void {
    const overlay = this.config.overlay();
    if (!overlay) return;
    this.resizeObserver = new ResizeObserver(() => this.updatePosition());
    this.resizeObserver.observe(overlay);
  }
}
