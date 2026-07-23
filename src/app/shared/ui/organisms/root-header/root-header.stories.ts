import type { Meta, StoryObj } from '@storybook/angular';
import { RootHeader } from './root-header';
import { Button } from '../../atoms/button/button';
import { LucideBell } from '@lucide/angular';
import { LocationPicker } from '../location-picker/location-picker';
import { provideRouter } from '@angular/router';

const meta: Meta<RootHeader> = {
  title: 'Organisms/Headers/RootHeader',
  component: RootHeader,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      providers: [provideRouter([])]
    })
  ],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [Button, LucideBell, LocationPicker],
    },
    template: `
      <div style="height: 300px; background: var(--surface-container-low); margin: -1rem;">
        <app-root-header [avatarSrc]="avatarSrc" [sticky]="sticky">
          <div rootHeaderCenter>
            <app-location-picker></app-location-picker>
          </div>
          <div rootHeaderEnd>
            <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Notifications">
              <svg lucideBell></svg>
            </button>
          </div>
        </app-root-header>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<RootHeader>;

export const Default: Story = {
  args: {
    avatarSrc: 'https://i.pravatar.cc/150?img=11',
    sticky: true,
  },
};
