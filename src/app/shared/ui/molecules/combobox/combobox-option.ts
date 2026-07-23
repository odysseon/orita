import { Component, input, HostBinding, HostListener, inject, ElementRef, OnInit, OnDestroy, output } from '@angular/core';
import { ComboboxContext } from './combobox.context';

let nextId = 0;

@Component({
  selector: 'button[uiComboboxOption], ui-combobox-option',
  template: `<ng-content></ng-content>`,
  standalone: true,
  host: {
    '[class.combobox-option]': 'true'
  }
})
export class ComboboxOption implements OnInit, OnDestroy {
  #ctx = inject(ComboboxContext);
  #el = inject(ElementRef);

  readonly value = input.required<any>();
  readonly disabled = input<boolean>(false);
  readonly selected = output<any>();
  
  @HostBinding('attr.id') id = `combobox-option-${nextId++}`;
  @HostBinding('attr.role') role = 'option';
  
  @HostBinding('attr.aria-selected') get isSelected() {
    return this.#ctx.selectedValue() === this.value();
  }

  @HostBinding('class.combobox-option--active') get isActive() {
    return this.#ctx.activeDescendant() === this.id;
  }

  @HostBinding('class.combobox-option--selected') get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.combobox-option--disabled') get isDisabledClass() {
    return this.disabled();
  }

  @HostListener('mouseenter')
  onHover() {
    if (!this.disabled()) {
      this.#ctx.activeDescendant.set(this.id);
    }
  }

  @HostListener('click')
  onClick() {
    if (!this.disabled()) {
      this.#ctx.selectedValue.set(this.value());
      this.selected.emit(this.value());
    }
  }

  ngOnInit() {
    this.#ctx.registerOption({
      id: this.id,
      value: this.value(),
      element: this.#el.nativeElement,
      disabled: this.disabled()
    });
  }

  ngOnDestroy() {
    this.#ctx.unregisterOption(this.id);
  }
}
