import {
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AnchorPlacement, AnchorPosition, AnchorPositionService } from '../anchor-position.service';

let nextId = 0;

@Component({
  selector: 'app-tooltip-overlay',
  standalone: true,
  styleUrl: './tooltip.css',
  template: `{{ text() }}`,
  host: {
    '[id]': 'id()',
    'class': 'app-tooltip',
    '[class]': '"app-tooltip--" + intent()',
    'role': 'tooltip',
    '[style.top]': '`calc(var(--size-1) * ${pos()?.top ?? 0})`',
    '[style.left]': '`calc(var(--size-1) * ${pos()?.left ?? 0})`',
    '[style.opacity]': 'pos() ? 1 : 0',
    '[style.pointer-events]': 'pos() ? "auto" : "none"',
  }
})
export class TooltipOverlay {
  id = signal('');
  text = signal('');
  intent = signal<'neutral' | 'inverse'>('inverse');
  pos = signal<AnchorPosition | null>(null);

  el = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  providers: [AnchorPositionService],
  host: {
    '[attr.aria-describedby]': 'tooltipId',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown.escape)': 'onEscape()',
    '(touchstart)': 'onTouchStart()',
  },
})
export class TooltipDirective implements OnDestroy {
  appTooltip = input<string>('');
  position = input<AnchorPlacement>('top-center');
  tooltipIntent = input<'neutral' | 'inverse'>('inverse');

  private vcr = inject(ViewContainerRef);
  private el = inject(ElementRef<HTMLElement>);
  private anchorService = inject(AnchorPositionService);

  private overlayRef: ComponentRef<TooltipOverlay> | null = null;
  private isOpen = signal(false);
  private isTouch = false;

  readonly tooltipId = `tooltip-${nextId++}`;

  constructor() {
    this.anchorService.init({
      trigger: () => this.el.nativeElement,
      overlay: () => this.overlayRef?.instance.el.nativeElement || null,
      placement: () => this.position(),
      isOpen: () => this.isOpen(),
      offset: 6,
    });

    effect(() => {
      const pos = this.anchorService.position();
      if (this.overlayRef) {
        this.overlayRef.instance.pos.set(pos);
      }
    });

    effect(() => {
      // Auto-close if the trigger scrolls out of view.
      if (this.isOpen() && !this.anchorService.triggerVisible()) {
        this.close();
      }
    });
  }

  onTouchStart() {
    this.isTouch = true;
  }

  onMouseEnter() {
    if (this.isTouch) return;
    this.open();
  }

  onMouseLeave() {
    this.close();
  }

  onFocus() {
    if (this.isTouch) return;
    this.open();
  }

  onBlur() {
    this.close();
  }

  onEscape() {
    this.close();
  }

  private open() {
    if (this.isOpen() || !this.appTooltip()) return;
    this.isOpen.set(true);

    this.overlayRef = this.vcr.createComponent(TooltipOverlay);
    document.body.appendChild(this.overlayRef.location.nativeElement);

    this.overlayRef.instance.id.set(this.tooltipId);
    this.overlayRef.instance.text.set(this.appTooltip());
    this.overlayRef.instance.intent.set(this.tooltipIntent());
  }

  private close() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);

    if (this.overlayRef) {
      this.overlayRef.destroy();
      this.overlayRef = null;
    }
  }

  ngOnDestroy() {
    this.close();
  }
}
