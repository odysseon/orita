import { Component, input, HostBinding } from '@angular/core';
import { ButtonIntent } from '../../atoms/button/button';

export type FabSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[ui-fab], a[ui-fab]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrl: './fab.css',
})
export class Fab {
  intent = input<ButtonIntent>('primary');
  size = input<FabSize>('md');
  disabled = input<boolean>(false);
  extended = input<boolean>(false);

  @HostBinding('class') get hostClass() {
    let base = `ui-fab intent-${this.intent()} size-${this.size()}`;
    if (this.extended()) {
      base += ' is-extended';
    }
    return base;
  }

  @HostBinding('attr.disabled') get nativeDisabled() {
    return this.disabled() ? true : null;
  }
}
