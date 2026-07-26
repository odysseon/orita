import { Component, output, effect, input, ViewEncapsulation } from '@angular/core';
import { ComboboxContext } from './combobox.context';

@Component({
  selector: 'ui-combobox',
  template: `<ng-content></ng-content>`,
  providers: [ComboboxContext],
  standalone: true,
  styleUrl: './combobox.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.combobox]': 'true'
  }
})
export class Combobox {
  readonly value = input<any>();
  readonly selected = output<any>();
  
  constructor(private ctx: ComboboxContext) {
    effect(() => {
      const val = this.value();
      if (val !== undefined) {
        this.ctx.selectedValue.set(val);
      }
    });

    effect(() => {
      const val = this.ctx.selectedValue();
      if (val !== undefined && val !== this.value()) {
        this.selected.emit(val);
      }
    });
  }
}
