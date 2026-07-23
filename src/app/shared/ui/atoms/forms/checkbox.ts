import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: 'input[type="checkbox"][app-checkbox]',
  standalone: true,
  host: {
    '[class.app-checkbox]': 'true',
  }
})
export class CheckboxDirective {
  /** 
   * Sets the visual indeterminate state of the checkbox.
   * This is necessary because indeterminate is a DOM property, not an HTML attribute.
   */
  indeterminate = input<boolean>(false);

  private el = inject(ElementRef<HTMLInputElement>);

  constructor() {
    effect(() => {
      this.el.nativeElement.indeterminate = this.indeterminate();
    });
  }
}
