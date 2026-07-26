import { Meta, StoryObj } from '@storybook/angular';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['plain', 'filled', 'outlined', 'elevated'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card
        [appearance]="appearance"
        [padding]="padding"
        [radius]="radius"
        [interactive]="interactive"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
      >
        <h3 style="margin: 0 0 4px 0;">John Doe</h3>
        <p style="margin: 0; color: var(--text-secondary);">Software Engineer</p>
      </app-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<Card>;

export const DefaultFilled: Story = {
  args: {
    appearance: 'filled',
    padding: 'md',
    radius: 'md',
  },
};

export const Plain: Story = {
  args: {
    ...DefaultFilled.args,
    appearance: 'plain',
  },
};

export const Outlined: Story = {
  args: {
    ...DefaultFilled.args,
    appearance: 'outlined',
  },
};

export const Elevated: Story = {
  args: {
    ...DefaultFilled.args,
    appearance: 'elevated',
  },
};

export const InteractiveOutlined: Story = {
  args: {
    ...DefaultFilled.args,
    appearance: 'outlined',
    interactive: true,
  },
};

export const Disabled: Story = {
  args: {
    ...DefaultFilled.args,
    interactive: true,
    disabled: true,
  },
};
