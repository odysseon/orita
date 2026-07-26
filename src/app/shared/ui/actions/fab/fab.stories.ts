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
      <div style="position: relative; width: 100%; height: 300px; background: var(--surface-container); border: 1px dashed var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden;">
        
        @if (appearance === 'glass') {
          <img src="https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=600" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" />
        }
        
        <button ui-fab [intent]="intent" [appearance]="appearance" [size]="size" [disabled]="disabled" [extended]="extended" style="position: absolute; bottom: 24px; right: 24px;">
          <svg lucidePlus></svg>
          @if (extended) {
            <span>Create</span>
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
    appearance: 'solid',
    size: 'md',
    disabled: false,
    extended: false,
  },
};

export const Extended: Story = {
  args: {
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
    disabled: false,
    extended: true,
  },
};

export const Glass: Story = {
  args: {
    intent: 'primary',
    appearance: 'glass',
    size: 'md',
    disabled: false,
    extended: false,
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
