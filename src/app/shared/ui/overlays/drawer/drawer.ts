import {
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
import { DRAWER_DEFAULTS, DrawerPosition, DrawerSize } from './drawer.model';
import { DrawerScrollService } from './drawer-scroll.service';
import { DrawerFocusService } from './drawer-focus.service';
import { DrawerDragService } from './drawer-drag.service';

import { Button } from '../../atoms/button/button';

export type { DrawerSize };

@Component({
  selector: 'ui-drawer, app-drawer',
  imports: [Button],

  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
  providers: [DrawerFocusService, DrawerDragService],
})
export class Drawer implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly scrollService = inject(DrawerScrollService);
  private readonly focusService = inject(DrawerFocusService);
  readonly dragService = inject(DrawerDragService);

  private isOpeningScheduled = false;

  open = model<boolean>(false);
  position = input<DrawerPosition>(DRAWER_DEFAULTS.position);
  size = input<DrawerSize>(DRAWER_DEFAULTS.size);
  closeOnBackdrop = input<boolean>(DRAWER_DEFAULTS.closeOnBackdrop);
  closeOnEscape = input<boolean>(DRAWER_DEFAULTS.closeOnEscape);
  dismissible = input<boolean>(DRAWER_DEFAULTS.dismissible);
  showCloseButton = input<boolean>(DRAWER_DEFAULTS.showCloseButton);
  title = input<string>();
  ariaLabel = input<string>(DRAWER_DEFAULTS.ariaLabel);

  opened = output<void>();
  closed = output<void>();
  dismissed = output<void>();

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  readonly isRendered = signal(false);
  readonly isOpenPhase = signal(false);

  readonly showHeader = computed(() => !!this.title() || this.showCloseButton());

  readonly isCenter = computed(() => this.position() === 'center');
  readonly isVertical = computed(() => this.position() === 'top' || this.position() === 'bottom');

  readonly backdropOpacity = computed(() => {
    if (!this.dragService.isDragging()) return this.isOpenPhase() ? 1 : 0;
    const delta = Math.abs(this.dragService.dragDelta());
    const size = this.drawerSize();
    if (size === 0) return 1;
    return Math.max(0, 1 - delta / size);
  });

  positionClass = computed(() => `drawer-panel--${this.position()}`);

  panelStyle = computed(() => {
    const pos = this.position();
    const s = this.size();
    const base: Record<string, string> = {};

    if (pos === 'left' || pos === 'right') {
      const widthMap: Record<DrawerSize, string> = {
        sm: 'var(--size-320, var(--size-320))',
        md: 'var(--size-400)',
        lg: 'var(--size-560, var(--size-560))',
        full: '100vw',
      };
      base['width'] = widthMap[s] ?? 'var(--size-400)';
      base['max-width'] = '100vw';
      base['height'] = '100%';
    } else if (pos === 'top' || pos === 'bottom') {
      const maxHeightMap: Record<DrawerSize, string> = {
        sm: 'min(45vh, 45dvh)',
        md: 'min(65vh, 65dvh)',
        lg: 'min(85vh, 85dvh)',
        full: '100vh',
      };
      base['width'] = '100%';
      base['height'] = 'auto';
      base['max-height'] = maxHeightMap[s] ?? 'min(65vh, 65dvh)';
    } else {
      const widthMap: Record<DrawerSize, string> = {
        sm: 'var(--size-360)',
        md: 'var(--size-480, var(--size-480))',
        lg: 'var(--size-640)',
        full: '95vw',
      };
      const maxHeightMap: Record<DrawerSize, string> = {
        sm: '50vh',
        md: '75vh',
        lg: '85vh',
        full: '95vh',
      };
      base['width'] = widthMap[s] ?? 'var(--size-480, var(--size-480))';
      base['max-width'] = '90vw';
      base['max-height'] = maxHeightMap[s] ?? '75vh';
      base['border-radius'] = 'var(--radius-lg)';
    }

    const dragTrans = this.dragService.dragTransform();
    if (dragTrans) {
      base['transform'] = dragTrans;
      base['transition'] = 'none';
    }

    return base;
  });

  constructor() {
    this.dragService.init({
      position: this.position,
      isCenter: this.isCenter,
      isVertical: this.isVertical,
      dismissible: this.dismissible,
      drawerSize: () => this.drawerSize(),
      requestClose: () => this.requestClose(),
    });

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
    this.scrollService.unlock();
  }

  close() {
    if (!this.dismissible()) return;
    this.open.set(false);
  }

  requestClose(): void {
    if (!this.dismissible()) return;
    this.open.set(false);
    this.dismissed.emit();
  }

  onBackdropClick() {
    if (!this.closeOnBackdrop() || !this.dismissible()) return;
    this.requestClose();
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (!this.open()) return;

    if (event.key === 'Escape' && this.closeOnEscape() && this.dismissible()) {
      event.preventDefault();
      this.requestClose();
      return;
    }

    if (event.key === 'Tab') {
      const panel = this.panelRef()?.nativeElement;
      if (panel) {
        this.focusService.trapFocus(panel, event);
      }
    }
  };

  onPanelTransitionEnd(event: TransitionEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains('drawer-panel')) return;
    if (!this.isOpenPhase() && this.isRendered()) {
      this.finishClose();
    }
  }

  private openDrawer(): void {
    if ((this.isRendered() && this.isOpenPhase()) || this.isOpeningScheduled) return;
    this.isOpeningScheduled = true;
    this.focusService.remember();
    this.isRendered.set(true);
    this.dragService.reset();

    afterNextRender(
      () => {
        this.isOpeningScheduled = false;
        this.scrollService.lock();
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
    this.dragService.reset();

    // Fallback: in case transitionend does not fire
    setTimeout(() => {
      if (!this.isOpenPhase() && this.isRendered()) {
        this.finishClose();
      }
    }, 450); // duration-slow is 400ms
  }

  private finishClose(): void {
    this.isRendered.set(false);
    this.dragService.reset();
    this.scrollService.unlock();
    this.focusService.restore();
    this.closed.emit();
  }

  private drawerSize(): number {
    return this.panelRef()?.nativeElement[this.isVertical() ? 'offsetHeight' : 'offsetWidth'] ?? 0;
  }
}
