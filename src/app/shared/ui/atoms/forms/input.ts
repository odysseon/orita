import { Directive, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: '[app-input]',
  standalone: true,
  host: {
    '[class.app-input]': 'true',
  }
})
export class InputDirective {}
