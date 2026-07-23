import { Directive } from '@angular/core';

@Directive({
  selector: 'input[type="checkbox"][app-switch]',
  standalone: true,
  host: {
    '[class.app-switch]': 'true',
    'role': 'switch'
  }
})
export class SwitchDirective {}
