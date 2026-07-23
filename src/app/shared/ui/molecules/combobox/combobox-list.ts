import { Component } from '@angular/core';

@Component({
  selector: 'ui-combobox-list',
  template: `<div class="combobox-list" role="listbox"><ng-content></ng-content></div>`,
  standalone: true
})
export class ComboboxList {}
