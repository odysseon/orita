import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';

import {
  DISTANCE_THRESHOLD,
  DRAWER_DEFAULTS,
  DrawerPosition,
  VELOCITY_THRESHOLD,
} from './drawer.model';

type DrawerSide = 'left' | 'right' | 'bottom';

interface PointerState {
  startX: number;
  startY: number;
  startTime: number;
  currentDelta: number;
  active: boolean;
}

let openDrawerCount = 0;

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-open]': 'isOpenPhase()',
  },
})
export class AppDrawer implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------
  open = model<boolean>(false);
  position = input<DrawerPosition>(DRAWER_DEFAULTS.position);
  size = input<string>(DRAWER_DEFAULTS.size);
  closeOnBackdrop = input<boolean>(DRAWER_DEFAULTS.closeOnBackdrop);
  closeOnEscape = input<boolean>(DRAWER_DEFAULTS.closeOnEscape);
  dismissible = input<boolean>(DRAWER_DEFAULTS.dismissible);
  showCloseButton = input<boolean>(DRAWER_DEFAULTS.showCloseButton);
  title = input<string>();
  ariaLabel = input<string>(DRAWER_DEFAULTS.ariaLabel);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------
  opened = output<void>();
  closed = output<void>();
  dismissed = output<void>();

  // -------------------------------------------------------------------------
  // Template refs
  // -------------------------------------------------------------------------
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  // -------------------------------------------------------------------------
  // Internal state
  // -------------------------------------------------------------------------
  readonly isRendered = signal(false);
  readonly isOpenPhase = signal(false);
  readonly isDragging = signal(false);
  readonly dragOffset = signal(0);

  private pointer: PointerState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    currentDelta: 0,
    active: false,
  };

  private lastFocusedElement: HTMLElement | null = null;
  private removeKeydownListener: (() => void) | null = null;

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------
  readonly isCenter = computed(() => this.position() === 'center');
  readonly isVertical = computed(() => this.position() === 'top' || this.position() === 'bottom');

  readonly isSideDrawer = computed(
    () => this.position() === 'left' || this.position() === 'right' || this.position() === 'bottom',
  );

  readonly showHeader = computed(() => !!this.title() || this.showCloseButton());

  readonly panelTransform = computed(() => {
    const offset = this.dragOffset();
    if (offset <= 0) return null;
    const pos = this.position();
    if (pos === 'left') return `translate3d(${-offset}px, 0, 0)`;
    if (pos === 'bottom') return `translate3d(0, ${offset}px, 0)`;
    if (pos === 'right') return `translate3d(${offset}px, 0, 0)`;
    return null;
  });

  readonly backdropOpacity = computed(() => {
    if (!this.isDragging()) return this.isOpenPhase() ? 1 : 0;
    const offset = this.dragOffset();
    const size = this.drawerSizePx();
    if (size === 0) return 1;
    return Math.max(0, 1 - offset / size);
  });

  readonly positionClass = computed(() => `drawer-panel--${this.position()}`);

  readonly panelStyle = computed(() => {
    const pos = this.position();
    const s = this.size();
    const base: Record<string, string> = {};

    if (pos === 'left' || pos === 'right') {
      base['width'] = s;
      base['max-width'] = 'min(92vw, 560px)';
      base['height'] = '100dvh';
    } else if (pos === 'top' || pos === 'bottom') {
      base['width'] = '100%';
      base['height'] = s;
      base['max-height'] = 'min(88dvh, 640px)';
    } else {
      // center — dialog mode
      base['width'] = s;
      base['max-width'] = 'min(92vw, 480px)';
      base['max-height'] = '90vh';
    }

    if (this.panelTransform()) {
      base['transform'] = this.panelTransform()!;
      base['transition'] = 'none';
    }

    return base;
  });

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------
  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (isOpen) {
        this.openDrawer();
        return;
      }
      if (this.isRendered() && this.isOpenPhase()) {
        this.beginClose();
      }
    });
  }

  ngOnDestroy(): void {
    this.teardownKeydown();
    this.unlockBodyScroll();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  close(): void {
    if (!this.dismissible()) return;
    this.beginClose();
    this.open.set(false);
    this.dismissed.emit();
  }

  // -------------------------------------------------------------------------
  // Backdrop
  // -------------------------------------------------------------------------
  onBackdropClick(): void {
    if (!this.closeOnBackdrop()) return;
    this.close();
  }

  // -------------------------------------------------------------------------
  // Keyboard
  // -------------------------------------------------------------------------
  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.isRendered() || !this.dismissible()) return;
    if (!this.closeOnEscape()) return;
    event.preventDefault();
    this.close();
  };

  // -------------------------------------------------------------------------
  // Pointer / drag handling
  // -------------------------------------------------------------------------
  onDragStart(event: PointerEvent): void {
    if (!this.dismissible() || this.isCenter() || event.button !== 0) return;

    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    panel.setPointerCapture(event.pointerId);
    this.pointer = {
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      currentDelta: 0,
      active: true,
    };
    this.isDragging.set(true);
    this.dragOffset.set(0);
    event.preventDefault();
  }

  onDragMove(event: PointerEvent): void {
    if (!this.pointer.active) return;

    const rawDelta = this.isVertical()
      ? event.clientY - this.pointer.startY
      : event.clientX - this.pointer.startX;

    const resistedDelta = this.resistDelta(rawDelta);
    this.pointer.currentDelta = resistedDelta;
    this.dragOffset.set(Math.max(0, resistedDelta));
  }

  onDragEnd(event: PointerEvent): void {
    if (!this.pointer.active) return;

    const panel = this.panelRef()?.nativeElement;
    panel?.releasePointerCapture(event.pointerId);

    const delta = Math.abs(this.pointer.currentDelta);
    const elapsed = event.timeStamp - this.pointer.startTime;
    const velocity = elapsed > 0 ? delta / elapsed : 0;
    const size = this.drawerSizePx();

    const pastDistance = size > 0 && delta / size > DISTANCE_THRESHOLD;
    const pastVelocity = velocity > VELOCITY_THRESHOLD;

    if (pastDistance || pastVelocity) {
      this.close();
    } else {
      this.dragOffset.set(0);
    }

    this.pointer.active = false;
    this.isDragging.set(false);
  }

  onDragCancel(): void {
    this.pointer.active = false;
    this.dragOffset.set(0);
    this.isDragging.set(false);
  }

  // -------------------------------------------------------------------------
  // Transition
  // -------------------------------------------------------------------------
  onPanelTransitionEnd(event: TransitionEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains('drawer-panel')) return;
    if (!this.isOpenPhase()) {
      this.isRendered.set(false);
      this.dragOffset.set(0);
      this.teardownKeydown();
      this.unlockBodyScroll();
      this.restoreFocus();
      this.closed.emit();
    }
  }

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------
  private openDrawer(): void {
    if (this.isRendered() && this.isOpenPhase()) return;
    this.rememberFocus();
    this.isRendered.set(true);
    this.dragOffset.set(0);

    afterNextRender(() => {
      this.setupKeydown();
      this.lockBodyScroll();
      this.isOpenPhase.set(true);
      this.panelRef()?.nativeElement.focus();
      this.opened.emit();
    });
  }

  private beginClose(): void {
    if (!this.isRendered()) return;
    this.isOpenPhase.set(false);
    this.isDragging.set(false);
    this.dragOffset.set(0);
  }

  private setupKeydown(): void {
    this.teardownKeydown();
    this.document.addEventListener('keydown', this.onKeyDown);
    this.removeKeydownListener = () => this.document.removeEventListener('keydown', this.onKeyDown);
  }

  private teardownKeydown(): void {
    this.removeKeydownListener?.();
    this.removeKeydownListener = null;
  }

  private lockBodyScroll(): void {
    if (openDrawerCount === 0) {
      this.document.body.style.overflow = 'hidden';
    }
    openDrawerCount += 1;
  }

  private unlockBodyScroll(): void {
    if (openDrawerCount <= 0) return;
    openDrawerCount -= 1;
    if (openDrawerCount === 0) {
      this.document.body.style.overflow = '';
    }
  }

  private rememberFocus(): void {
    const active = this.document.activeElement;
    this.lastFocusedElement = active instanceof HTMLElement ? active : null;
  }

  private restoreFocus(): void {
    this.lastFocusedElement?.focus();
    this.lastFocusedElement = null;
  }

  private drawerSizePx(): number {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return 1;
    return this.isVertical() ? panel.offsetHeight : panel.offsetWidth;
  }

  private resistDelta(raw: number): number {
    const pos = this.position();
    const isClosingDirection =
      (pos === 'left' && raw < 0) ||
      (pos === 'right' && raw > 0) ||
      (pos === 'top' && raw < 0) ||
      (pos === 'bottom' && raw > 0);

    if (isClosingDirection) return raw;
    return raw * 0.15;
  }
}
