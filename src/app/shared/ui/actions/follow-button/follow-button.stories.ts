import { Meta, StoryObj } from '@storybook/angular';
import { FollowButton } from './follow-button';

const meta: Meta<FollowButton> = {
  title: 'Actions/FollowButton',
  component: FollowButton,
  tags: ['autodocs'],
  argTypes: {
    isFollowed: { control: 'boolean' },
    layout: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    toggle: { action: 'toggled' },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-follow-button
        [isFollowed]="isFollowed"
        [size]="size"
        [display]="display"
        [layout]="layout"
        [fullWidth]="fullWidth"
        (toggle)="toggle($event)"
      ></ui-follow-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<FollowButton>;

export const Default: Story = {
  args: {
    isFollowed: false,
    layout: 'horizontal',
    size: 'md',
    fullWidth: false,
  },
};

export const Following: Story = {
  args: {
    isFollowed: true,
    layout: 'horizontal',
    size: 'md',
    fullWidth: false,
  },
};

export const IconText: Story = {
  args: {
    isFollowed: false,
    layout: 'horizontal',
    size: 'md',
    fullWidth: false,
  },
};

export const VerticalIconText: Story = {
  args: {
    isFollowed: false,
    layout: 'vertical',
    size: 'md',
    fullWidth: false,
  },
};

export const IconOnly: Story = {
  args: {
    isFollowed: false,
    layout: 'horizontal',
    size: 'md',
    fullWidth: false,
  },
};

export const Small: Story = {
  args: {
    isFollowed: false,
    size: 'sm',
    fullWidth: false,
  },
};
