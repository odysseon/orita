import {
  Component,
  input,
  computed,
  signal,
  booleanAttribute,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Spinner } from '../spinner/spinner';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ButtonAppearance = 'solid' | 'outline' | 'ghost' | 'soft' | 'link' | 'plain' | 'glass';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';
export type ButtonShape = 'default' | 'square' | 'circle' | 'pill';
export type ButtonLayout = 'horizontal' | 'vertical';

@Component({
  selector: 'button[app-button], a[app-button]',
  standalone: true,
  imports: [Spinner],
  templateUrl: './button.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.type]': 'isButton() ? type() : null',
    '[attr.disabled]': '(isButton() && (disabled() || loading())) ? true : null',
    '[attr.aria-disabled]': 'disabled() || loading() ? "true" : null',
    '[attr.tabindex]': '(!isButton() && (disabled() || loading())) ? "-1" : null',
    '[attr.data-intent]': 'intent()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-layout]': 'layout()',
    '[class]': 'classes()',
    '(click)': 'onClick($event)',
  },
})
export class Button {
  private el = inject(ElementRef);

  type = input<ButtonType>('button');
  intent = input<ButtonIntent>('primary');
  appearance = input<ButtonAppearance>('solid');
  shape = input<ButtonShape>('default');
  size = input<ButtonSize>('md');
  layout = input<ButtonLayout>('horizontal');
  disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  fullWidth = input<boolean, unknown>(false, { transform: booleanAttribute });

  // Override signals for sibling behaviors (e.g. TabTrigger) on the same host
  readonly overrideIntent = signal<ButtonIntent | null>(null);
  readonly overrideAppearance = signal<ButtonAppearance | null>(null);
  readonly overrideSize = signal<ButtonSize | null>(null);

  isButton = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'button');

  classes = computed(() => {
    const intent = this.overrideIntent() || this.intent();
    const appearance = this.overrideAppearance() || this.appearance();
    const size = this.overrideSize() || this.size();

    const classList = [
      'btn',
      `btn--${intent}`,
      `btn--${appearance}`,
      `btn--${size}`,
      `btn--layout-${this.layout()}`,
    ];

    if (this.shape() !== 'default') classList.push(`btn--shape-${this.shape()}`);
    if (this.fullWidth()) classList.push('btn--full');
    if (this.loading()) classList.push('is-loading');

    return classList.join(' ');
  });

  onClick(event: Event) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
