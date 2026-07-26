import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { SearchHeader } from './search-header';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';

const mockAuthService = {
  token: signal('fake-token'),
  currentUser: signal({ avatarUrl: 'https://i.pravatar.cc/150?img=11', username: 'testuser' })
};

const meta: Meta<SearchHeader> = {
  title: 'Organisms/Headers/SearchHeader',
  component: SearchHeader,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 300px; background: var(--surface-container-low); margin: -1rem;">
        <app-search-header 
          [sticky]="sticky"
          [placeholder]="placeholder"
          [query]="query"
          (search)="onSearch($event)"
          (filter)="onFilter()"
        >
        </app-search-header>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SearchHeader>;

export const Default: Story = {
  args: {
    sticky: true,
    placeholder: 'Search for tours, guides...',
    query: '',
  },
};
