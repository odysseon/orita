import { Meta, StoryObj } from '@storybook/angular';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from './index';
import { SearchBar } from '../search-bar/search-bar';
import { InputDirective } from '../../atoms/forms';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-combobox-demo',
  imports: [Combobox, ComboboxInput, ComboboxList, ComboboxOption, SearchBar, InputDirective],
  template: `
    <div style="max-width: 25rem; padding: var(--size-20); border: var(--size-1) solid var(--border-default); border-radius: var(--radius-md);">
      
      <ui-combobox [value]="selected()" (selected)="onSelect($event)">
        <ui-search-bar>
          <input uiComboboxInput app-input type="text" placeholder="Search cities..." [value]="query()" (input)="query.set($any($event.target).value)" />
        </ui-search-bar>

        <ui-combobox-list style="margin-top: var(--size-8);">
          @for (option of filteredOptions(); track option.id) {
            <button uiComboboxOption [value]="option">
              {{ option.name }}
            </button>
          } @empty {
            <div style="padding: var(--size-12); color: var(--text-muted);">No results found.</div>
          }
        </ui-combobox-list>
      </ui-combobox>

      <div style="margin-top: var(--size-20); padding-top: var(--size-12); border-top: var(--size-1) solid var(--border-subtle); font-size: var(--size-14);">
        <strong>Selected:</strong> {{ selected()?.name || 'None' }}
      </div>
    </div>
  `
})
class ComboboxDemo {
  query = signal('');
  selected = signal<any>(null);

  allOptions = [
    { id: '1', name: 'Lagos' },
    { id: '2', name: 'Ikeja' },
    { id: '3', name: 'Lekki' },
    { id: '4', name: 'Abuja' },
    { id: '5', name: 'Port Harcourt' },
  ];

  filteredOptions = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.allOptions;
    return this.allOptions.filter(o => o.name.toLowerCase().includes(q));
  });

  onSelect(option: any) {
    this.selected.set(option);
    console.log('Selected:', option);
  }
}

const meta: Meta<ComboboxDemo> = {
  title: 'Compounds/Combobox',
  component: ComboboxDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ComboboxDemo>;

export const Default: Story = {};
