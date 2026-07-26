import { Meta, StoryObj } from '@storybook/angular';
import { FollowButton } from './follow-button';

const meta: Meta<FollowButton> = {
  title: 'Actions/FollowButton',
  component: FollowButton,
  tags: ['autodocs'],
  argTypes: {
    isFollowed: { control: 'boolean' },
    display: { control: 'select', options: ['text', 'icon', 'icon-text'] },
    layout: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    toggle: { action: 'toggled' }
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
    `
  })
};

export default meta;
type Story = StoryObj<FollowButton>;

export const Default: Story = {
  args: {
    isFollowed: false,
    display: 'text',
    layout: 'horizontal',
    size: 'md',
    fullWidth: false
  }
};

export const Following: Story = {
  args: {
    isFollowed: true,
    display: 'text',
    layout: 'horizontal',
    size: 'md',
    fullWidth: false
  }
};

export const IconText: Story = {
  args: {
    isFollowed: false,
    display: 'icon-text',
    layout: 'horizontal',
    size: 'md',
    fullWidth: false
  }
};

export const VerticalIconText: Story = {
  args: {
    isFollowed: false,
    display: 'icon-text',
    layout: 'vertical',
    size: 'md',
    fullWidth: false
  }
};

export const IconOnly: Story = {
  args: {
    isFollowed: false,
    display: 'icon',
    layout: 'horizontal',
    size: 'md',
    fullWidth: false
  }
};

export const Small: Story = {
  args: {
    isFollowed: false,
    size: 'sm',
    fullWidth: false
  }
};
