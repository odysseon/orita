import type { Meta, StoryObj } from '@storybook/angular';
import { Logo } from './logo';

const meta: Meta<Logo> = {
  title: 'Atoms/Logo',
  component: Logo,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: var(--surface-container-lowest); display: flex; align-items: center;">
        <ui-logo [variant]="variant" [size]="size"></ui-logo>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<Logo>;

export const Full: Story = {
  args: {
    variant: 'full',
    size: 'md',
  },
};

export const MarkOnly: Story = {
  args: {
    variant: 'mark',
    size: 'md',
  },
};

export const WordmarkOnly: Story = {
  args: {
    variant: 'wordmark',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    variant: 'full',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    variant: 'full',
    size: 'lg',
  },
};
