import { Meta, StoryObj } from '@storybook/angular';
import { Avatar } from './avatar';

const meta: Meta<Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'radio',
      options: ['circle', 'rounded', 'square'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy', undefined],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <app-avatar
        [src]="src"
        [alt]="alt"
        [fallback]="fallback"
        [size]="size"
        [shape]="shape"
        [loading]="loading"
        [status]="status"
      ></app-avatar>
    `,
  }),
};

export default meta;
type Story = StoryObj<Avatar>;

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=11',
    alt: 'John Doe',
    size: 'md',
    shape: 'circle',
  },
};

export const FallbackInitials: Story = {
  args: {
    fallback: 'JD',
    size: 'md',
    shape: 'circle',
  },
};

export const FallbackIcon: Story = {
  args: {
    size: 'md',
    shape: 'circle',
  },
};

export const WithStatus: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=32',
    alt: 'Jane Smith',
    fallback: 'JS',
    size: 'lg',
    shape: 'circle',
    status: 'online',
  },
};

export const RoundedBrand: Story = {
  args: {
    fallback: 'BRAND',
    size: 'xl',
    shape: 'rounded',
  },
};
