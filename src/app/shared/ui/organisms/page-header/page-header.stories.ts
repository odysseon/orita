import type { Meta, StoryObj } from '@storybook/angular';
import { PageHeader } from './page-header';
import { Button } from '../../atoms/button/button';
import { LucideMoreVertical } from '@lucide/angular';

const meta: Meta<PageHeader> = {
  title: 'Organisms/Headers/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [Button, LucideMoreVertical],
    },
    template: `
      <div style="height: 300px; background: var(--surface-container-low); margin: -1rem;">
        <app-page-header [title]="title" [back]="back" [sticky]="sticky">
          <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Options">
            <svg lucideMoreVertical></svg>
          </button>
        </app-page-header>
        <div style="padding: 20px; color: var(--text-secondary);">
          Page content goes here...
        </div>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PageHeader>;

export const Default: Story = {
  args: {
    title: 'Settings',
    back: true,
    sticky: true,
  },
};

export const WithoutBack: Story = {
  args: {
    title: 'Settings',
    back: false,
    sticky: true,
  },
};
