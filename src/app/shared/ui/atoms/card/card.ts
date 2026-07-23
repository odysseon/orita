import {
  Component,
  input,
  computed,
  booleanAttribute,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';

export type CardAppearance = 'plain' | 'filled' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'app-card, button[app-card], a[app-card]',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.type]': 'isButton() ? "button" : null',
    '[attr.disabled]': 'isButton() && disabled() ? true : null',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.role]': 'role()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Card {
  private el = inject(ElementRef);

  appearance = input<CardAppearance>('filled');
  padding = input<CardPadding>('md');
  radius = input<CardRadius>('md');

  interactive = input<boolean, unknown>(false, { transform: booleanAttribute });
  disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  fullWidth = input<boolean, unknown>(false, { transform: booleanAttribute });

  isButton = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'button');
  isAnchor = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'a');
  isNativeControl = computed(() => this.isButton() || this.isAnchor());

  tabIndex = computed(() => {
    if (this.isButton()) return null; // native `disabled` attribute already removes it from tab order
    if (this.disabled()) return '-1'; // anchor or plain div — must force it out explicitly
    if (this.interactive()) return '0';
    return null;
  });

  role = computed(() => (this.interactive() && !this.isNativeControl() ? 'button' : null));

  classes = computed(() => {
    const classList = [
      'card',
      `card--${this.appearance()}`,
      `card--pad-${this.padding()}`,
      `card--rad-${this.radius()}`,
    ];
    if (this.interactive()) classList.push('is-interactive');
    if (this.disabled()) classList.push('is-disabled');
    if (this.fullWidth()) classList.push('card--full');
    return classList.join(' ');
  });

  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || this.disabled() || this.isNativeControl()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (this.el.nativeElement as HTMLElement).click();
    }
  }
}
