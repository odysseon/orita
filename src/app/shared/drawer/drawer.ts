import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
  afterNextRender,
  Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  DISTANCE_THRESHOLD,
  DRAWER_DEFAULTS,
  DrawerPosition,
  VELOCITY_THRESHOLD,
} from './drawer.model';

interface PointerState {
  startX: number;
  startY: number;
  startTime: number;
  currentDelta: number;
  active: boolean;
}

let openDrawerCount = 0;

@Component({
  selector: 'ui-drawer',
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  open = model<boolean>(false);
  position = input<DrawerPosition>(DRAWER_DEFAULTS.position);
  size = input<string>(DRAWER_DEFAULTS.size);
  closeOnBackdrop = input<boolean>(DRAWER_DEFAULTS.closeOnBackdrop);
  closeOnEscape = input<boolean>(DRAWER_DEFAULTS.closeOnEscape);
  dismissible = input<boolean>(DRAWER_DEFAULTS.dismissible);
  showCloseButton = input<boolean>(DRAWER_DEFAULTS.showCloseButton);
  title = input<string>();
  ariaLabel = input<string>(DRAWER_DEFAULTS.ariaLabel);

  opened = output<void>();
  closed = output<void>();

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private readonly dragDelta = signal(0);
  readonly isDragging = signal(false);

  readonly isRendered = signal(false);
  readonly isOpenPhase = signal(false);

  readonly showHeader = computed(() => !!this.title() || this.showCloseButton());

  private pointer: PointerState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    currentDelta: 0,
    active: false,
  };

  private lastFocusedElement: HTMLElement | null = null;

  readonly isCenter = computed(() => this.position() === 'center');
  readonly isVertical = computed(() => this.position() === 'top' || this.position() === 'bottom');

  readonly dragTransform = computed(() => {
    const delta = this.dragDelta();
    if (delta === 0) return '';
    const pos = this.position();
    switch (pos) {
      case 'left':
        return `translateX(${Math.min(delta, 0)}px)`;
      case 'right':
        return `translateX(${Math.max(delta, 0)}px)`;
      case 'top':
        return `translateY(${Math.min(delta, 0)}px)`;
      case 'bottom':
        return `translateY(${Math.max(delta, 0)}px)`;
      default:
        return '';
    }
  });

  readonly backdropOpacity = computed(() => {
    if (!this.isDragging()) return this.isOpenPhase() ? 1 : 0;
    const delta = Math.abs(this.dragDelta());
    const size = this.drawerSizePx();
    if (size === 0) return 1;
    return Math.max(0, 1 - delta / size);
  });

  private drawerSizePx(): number {
    return this.panelRef()?.nativeElement[this.isVertical() ? 'offsetHeight' : 'offsetWidth'] ?? 0;
  }

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

  ngOnInit() {
    this.document.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy() {
    this.document.removeEventListener('keydown', this.onKeyDown);
    this.unlockBodyScroll();
  }

  close() {
    if (!this.dismissible()) return;
    this.open.set(false);
  }

  onBackdropClick() {
    if (!this.closeOnBackdrop() || !this.dismissible()) return;
    this.close();
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.closeOnEscape() && this.dismissible() && this.open()) {
      this.close();
    }
  };

  onPanelTransitionEnd(event: TransitionEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains('drawer-panel')) return;
    if (!this.isOpenPhase()) {
      this.isRendered.set(false);
      this.dragDelta.set(0);
      this.unlockBodyScroll();
      this.restoreFocus();
      this.closed.emit();
    }
  }

  onPointerDown(event: PointerEvent) {
    if (this.isCenter() || !this.dismissible()) return;
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    this.pointer = {
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      currentDelta: 0,
      active: true,
    };
    this.isDragging.set(true);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.pointer.active) return;

    const rawDelta = this.isVertical()
      ? event.clientY - this.pointer.startY
      : event.clientX - this.pointer.startX;

    const resistedDelta = this.resistDelta(rawDelta);
    this.pointer.currentDelta = resistedDelta;
    this.dragDelta.set(resistedDelta);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.pointer.active) return;

    const delta = Math.abs(this.pointer.currentDelta);
    const elapsed = event.timeStamp - this.pointer.startTime;
    const velocity = elapsed > 0 ? delta / elapsed : 0;
    const size = this.drawerSizePx();

    const pastDistance = size > 0 && delta / size > DISTANCE_THRESHOLD;
    const pastVelocity = velocity > VELOCITY_THRESHOLD;

    if (pastDistance || pastVelocity) {
      this.close();
    }

    this.pointer.active = false;
    this.dragDelta.set(0);
    this.isDragging.set(false);
  }

  onPointerCancel() {
    this.pointer.active = false;
    this.dragDelta.set(0);
    this.isDragging.set(false);
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

  positionClass = computed(() => `drawer-panel--${this.position()}`);

  panelStyle = computed(() => {
    const pos = this.position();
    const s = this.size();
    const base: Record<string, string> = {};

    if (pos === 'left' || pos === 'right') {
      base['width'] = s;
      base['max-width'] = '100vw';
      base['height'] = '100%';
    } else if (pos === 'top' || pos === 'bottom') {
      base['width'] = '100%';
      base['height'] = s;
      base['max-height'] = '100vh';
    } else {
      base['width'] = s;
      base['max-width'] = '90vw';
      base['max-height'] = '90vh';
      base['border-radius'] = 'var(--radius-lg)';
    }

    if (this.dragTransform()) {
      base['transform'] = this.dragTransform();
      base['transition'] = 'none';
    }

    return base;
  });

  private openDrawer(): void {
    if (this.isRendered() && this.isOpenPhase()) return;
    this.rememberFocus();
    this.isRendered.set(true);
    this.dragDelta.set(0);

    afterNextRender(
      () => {
        this.lockBodyScroll();
        this.isOpenPhase.set(true);
        this.panelRef()?.nativeElement.focus();
        this.opened.emit();
      },
      { injector: this.injector },
    );
  }

  private beginClose(): void {
    if (!this.isRendered()) return;
    this.isOpenPhase.set(false);
    this.isDragging.set(false);
    this.dragDelta.set(0);
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
}
