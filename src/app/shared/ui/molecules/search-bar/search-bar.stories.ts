import { Meta, StoryObj } from '@storybook/angular';
import { SearchBar } from './search-bar';
import { InputDirective } from '../../atoms/forms';
import { FormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar-demo',
  imports: [SearchBar, InputDirective, FormsModule],
  template: `
    <div style="max-width: 400px;">
      <ui-search-bar (clear)="onClear()">
        <input app-input type="text" placeholder="Search locations..." [(ngModel)]="query" />
      </ui-search-bar>
      <p style="margin-top: 1rem; color: var(--text-muted); font-size: 14px;">
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
