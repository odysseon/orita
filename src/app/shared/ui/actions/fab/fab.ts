import { Component, input, HostBinding } from '@angular/core';
import { ButtonIntent } from '@odysseon/ur-ui';

export type FabSize = 'sm' | 'md' | 'lg';
export type FabAppearance = 'solid' | 'glass';

@Component({
  selector: 'button[ui-fab], a[ui-fab]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrl: './fab.css',
})
export class Fab {
  intent = input<ButtonIntent>('primary');
  appearance = input<FabAppearance>('solid');
  size = input<FabSize>('md');
  disabled = input<boolean>(false);
  extended = input<boolean>(false);

  @HostBinding('class') get hostClass() {
    let base = `ui-fab intent-${this.intent()} appearance-${this.appearance()} size-${this.size()}`;
    if (this.extended()) {
      base += ' is-extended';
    }
    return base;
  }

  @HostBinding('attr.disabled') get nativeDisabled() {
    return this.disabled() ? true : null;
  }
}
