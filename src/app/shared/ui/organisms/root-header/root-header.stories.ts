import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { RootHeader } from './root-header';
import { Button } from '@odysseon/ur-ui';
import { LucideBell } from '@lucide/angular';
import { LocationPicker } from '../location-picker/location-picker';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';

const mockAuthService = {
  token: signal('fake-token'),
  currentUser: signal({ avatarUrl: 'https://i.pravatar.cc/150?img=11', username: 'testuser' })
};

const meta: Meta<RootHeader> = {
  title: 'Organisms/Headers/RootHeader',
  component: RootHeader,
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
    moduleMetadata: {
      imports: [Button, LucideBell, LocationPicker],
    },
  }),
};

export default meta;
type Story = StoryObj<RootHeader>;

export const Home: Story = {
  args: {
    sticky: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: calc(var(--size-10) * 30); background: var(--surface-container-low); margin: -1rem;">
        <app-root-header [sticky]="sticky">
          <div rootHeaderCenter>
            <ui-location-picker></ui-location-picker>
          </div>
          <div rootHeaderEnd>
            <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Notifications">
              <svg lucideBell></svg>
            </button>
          </div>
        </app-root-header>
      </div>
    `,
  })
};

export const Minimal: Story = {
  args: {
    sticky: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: calc(var(--size-10) * 30); background: var(--surface-container-low); margin: -1rem;">
        <app-root-header [sticky]="sticky">
        </app-root-header>
      </div>
    `,
  })
};
