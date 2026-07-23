import { Directive } from '@angular/core';

@Directive({
  selector: 'input[type="radio"][app-radio]',
  standalone: true,
  host: {
    '[class.app-radio]': 'true',
  }
})
export class RadioDirective {}
