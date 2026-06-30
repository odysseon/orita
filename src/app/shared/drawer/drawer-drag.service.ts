import { Injectable, computed, signal, Signal } from '@angular/core';
import { DISTANCE_THRESHOLD, DrawerPosition, VELOCITY_THRESHOLD } from './drawer.model';

interface PointerState {
  startX: number;
  startY: number;
  startTime: number;
  currentDelta: number;
  active: boolean;
}

@Injectable()
export class DrawerDragService {
  private pointer: PointerState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    currentDelta: 0,
    active: false,
  };

  readonly dragDelta = signal(0);
  readonly isDragging = signal(false);

  private position!: Signal<DrawerPosition>;
  private isCenter!: Signal<boolean>;
  private isVertical!: Signal<boolean>;
  private dismissible!: Signal<boolean>;
  private drawerSizePx!: () => number;
  private requestClose!: () => void;

  init(config: {
    position: Signal<DrawerPosition>;
    isCenter: Signal<boolean>;
    isVertical: Signal<boolean>;
    dismissible: Signal<boolean>;
    drawerSizePx: () => number;
    requestClose: () => void;
  }): void {
    this.position = config.position;
    this.isCenter = config.isCenter;
    this.isVertical = config.isVertical;
    this.dismissible = config.dismissible;
    this.drawerSizePx = config.drawerSizePx;
    this.requestClose = config.requestClose;
  }

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

  reset(): void {
    this.dragDelta.set(0);
    this.isDragging.set(false);
    this.pointer.active = false;
  }

  onPointerDown(event: PointerEvent): void {
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

  onPointerMove(event: PointerEvent): void {
    if (!this.pointer.active) return;
    const rawDelta = this.isVertical()
      ? event.clientY - this.pointer.startY
      : event.clientX - this.pointer.startX;
    const resistedDelta = this.resistDelta(rawDelta);
    this.pointer.currentDelta = resistedDelta;
    this.dragDelta.set(resistedDelta);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointer.active) return;
    const delta = Math.abs(this.pointer.currentDelta);
    const elapsed = event.timeStamp - this.pointer.startTime;
    const velocity = elapsed > 0 ? delta / elapsed : 0;
    const size = this.drawerSizePx();

    const pastDistance = size > 0 && delta / size > DISTANCE_THRESHOLD;
    const pastVelocity = velocity > VELOCITY_THRESHOLD;

    if (pastDistance || pastVelocity) {
      this.requestClose();
    }
    this.reset();
  }

  onPointerCancel(): void {
    this.reset();
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
