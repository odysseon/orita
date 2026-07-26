import type { Meta, StoryObj } from '@storybook/angular';
import { ShareButton } from './share-button';

const meta: Meta<ShareButton> = {
  title: 'Actions/ShareButton',
  component: ShareButton,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['ghost', 'glass', 'solid', 'outline', 'soft', 'plain'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'default', 'pill'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    share: { action: 'share' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div [style.padding]="appearance === 'glass' ? '32px' : '16px'" 
           [style.background]="appearance === 'glass' ? 'url(https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=600) center/cover' : 'var(--surface-page)'"
           [style.border-radius]="appearance === 'glass' ? 'var(--radius-lg)' : 'none'"
           [style.display]="'inline-block'">
        
        <ui-share-button
          [appearance]="appearance"
          [shape]="shape"
          [size]="size"
          [disabled]="disabled"
          (share)="share($event)"
        ></ui-share-button>
        
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<ShareButton>;

export const Default: Story = {
  args: {
    appearance: 'ghost',
    shape: 'circle',
    size: 'md',
    disabled: false,
  },
};

export const Glass: Story = {
  args: {
    appearance: 'glass',
    shape: 'circle',
    size: 'md',
    disabled: false,
  },
};

export const Outline: Story = {
  args: {
    appearance: 'outline',
    shape: 'circle',
    size: 'md',
    disabled: false,
  },
};

export const Solid: Story = {
  args: {
    appearance: 'solid',
    shape: 'circle',
    size: 'md',
    disabled: false,
  },
};

export const Small: Story = {
  args: {
    appearance: 'ghost',
    shape: 'circle',
    size: 'sm',
    disabled: false,
  },
};

export const Large: Story = {
  args: {
    appearance: 'ghost',
    shape: 'circle',
    size: 'lg',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    appearance: 'ghost',
    shape: 'circle',
    size: 'md',
    disabled: true,
  },
};
