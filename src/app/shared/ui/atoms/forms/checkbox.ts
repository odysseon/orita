import { Directive, ElementRef, effect, inject, input } from '@angular/core';

export type CheckboxShape = 'default' | 'square' | 'circle';
export type CheckboxAppearance = 'solid' | 'outline' | 'ghost' | 'plain';
export type CheckboxSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'input[type="checkbox"][app-checkbox]',
  standalone: true,
  host: {
    '[class.app-checkbox]': 'true',
    '[class.app-checkbox--circle]': "shape() === 'circle'",
    '[class.app-checkbox--square]': "shape() === 'square'",
    '[class.app-checkbox--ghost]': "appearance() === 'ghost'",
    '[class.app-checkbox--plain]': "appearance() === 'plain'",
    '[class.app-checkbox--outline]': "appearance() === 'outline'",
    '[class.app-checkbox--sm]': "size() === 'sm'",
    '[class.app-checkbox--lg]': "size() === 'lg'",
  }
})
export class CheckboxDirective {
  /** 
   * Sets the visual indeterminate state of the checkbox.
   * This is necessary because indeterminate is a DOM property, not an HTML attribute.
   */
  indeterminate = input<boolean>(false);
  shape = input<CheckboxShape>('default');
  appearance = input<CheckboxAppearance>('solid');
  size = input<CheckboxSize>('md');

  private el = inject(ElementRef<HTMLInputElement>);

  constructor() {
    effect(() => {
      this.el.nativeElement.indeterminate = this.indeterminate();
    });
  }
}

