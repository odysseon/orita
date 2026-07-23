import {
  Component,
  input,
  computed,
  booleanAttribute,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Spinner } from '../spinner/spinner';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ButtonAppearance = 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

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
    '[class]': 'classes()',
    '(click)': 'onClick($event)',
  },
})
export class Button {
  private el = inject(ElementRef);

  type = input<ButtonType>('button');
  intent = input<ButtonIntent>('primary');
  appearance = input<ButtonAppearance>('solid');
  size = input<ButtonSize>('md');
  disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  fullWidth = input<boolean, unknown>(false, { transform: booleanAttribute });

  isButton = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'button');

  classes = computed(() => {
    const classList = [
      'btn',
      `btn--${this.intent()}`,
      `btn--${this.appearance()}`,
      `btn--${this.size()}`,
    ];

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
