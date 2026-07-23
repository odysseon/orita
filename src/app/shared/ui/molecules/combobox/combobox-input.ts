import { Directive, HostListener, HostBinding, inject } from '@angular/core';
import { ComboboxContext } from './combobox.context';

@Directive({
  selector: 'input[uiComboboxInput]',
  standalone: true
})
export class ComboboxInput {
  #ctx = inject(ComboboxContext);

  @HostBinding('attr.role') role = 'combobox';
  @HostBinding('attr.aria-autocomplete') autocomplete = 'list';
  @HostBinding('attr.aria-expanded') expanded = true;
  @HostBinding('attr.aria-activedescendant') get activeDescendant() {
    return this.#ctx.activeDescendant();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.#ctx.moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.#ctx.moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.#ctx.selectActive();
    }
  }
}
