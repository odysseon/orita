import { Meta, StoryObj } from '@storybook/angular';
import { SearchBar } from './search-bar';
import { InputDirective } from '../../atoms/forms';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar-demo',
  imports: [SearchBar, InputDirective],
  template: `
    <div style="max-width: 25rem;">
      <ui-search-bar (clear)="onClear()">
        <input app-input type="text" placeholder="Search locations..." [value]="query()" (input)="query.set($any($event.target).value)" />
      </ui-search-bar>
      <p style="margin-top: 1rem; color: var(--text-muted); font-size: var(--size-14);">
        Current Query: <strong>{{ query() || 'empty' }}</strong>
      </p>
    </div>
  `
})
class SearchBarDemo {
  query = signal('');

  onClear() {
    console.log('Search cleared!');
  }
}

const meta: Meta<SearchBarDemo> = {
  title: 'Molecules/SearchBar',
  component: SearchBarDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SearchBarDemo>;

export const Default: Story = {};
