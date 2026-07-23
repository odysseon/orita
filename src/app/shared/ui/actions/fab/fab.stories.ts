import type { Meta, StoryObj } from '@storybook/angular';
import { Fab } from './fab';
import { LucidePlus, LucidePenTool } from '@lucide/angular';

const meta: Meta<Fab> = {
  title: 'Actions/Fab',
  component: Fab,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [LucidePlus, LucidePenTool],
    },
    template: `
      <!-- Container to demonstrate positioning relative to screen, though FAB uses fixed positioning -->
      <div style="height: 300px; background: var(--surface-container); border: 1px dashed var(--border-color); transform: translate(0); position: relative;">
        <!-- Overriding position for storybook demo so it doesn't float over all of storybook UI -->
        <button ui-fab [intent]="intent" [size]="size" [disabled]="disabled" [extended]="extended" style="position: absolute;">
          <svg lucidePlus></svg>
          @if (extended) {
            <span>New Post</span>
          }
        </button>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<Fab>;

export const Default: Story = {
  args: {
    intent: 'primary',
    size: 'md',
    extended: false,
  },
};

export const Extended: Story = {
  args: {
    intent: 'primary',
    size: 'md',
    extended: true,
  },
};

export const Small: Story = {
  args: {
    intent: 'primary',
    size: 'sm',
    extended: false,
  },
};

export const Large: Story = {
  args: {
    intent: 'primary',
    size: 'lg',
    extended: false,
  },
};

export const Secondary: Story = {
  args: {
    intent: 'secondary',
    size: 'md',
    extended: true,
  },
};
