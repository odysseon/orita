import { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
    },
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  render: (args) => ({
    props: args,
    template: `<button app-button [intent]="intent" [appearance]="appearance" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth" [type]="type">Button Text</button>`,
  }),
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    intent: 'secondary',
  },
};

export const Success: Story = {
  args: {
    ...Primary.args,
    intent: 'success',
  },
};

export const Warning: Story = {
  args: {
    ...Primary.args,
    intent: 'warning',
  },
};

export const Danger: Story = {
  args: {
    ...Primary.args,
    intent: 'danger',
  },
};

export const Outline: Story = {
  args: {
    ...Primary.args,
    appearance: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    ...Primary.args,
    appearance: 'ghost',
  },
};

export const Soft: Story = {
  args: {
    ...Primary.args,
    appearance: 'soft',
  },
};

export const Link: Story = {
  args: {
    ...Primary.args,
    appearance: 'link',
  },
};

export const AllIntents: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <button app-button intent="primary">Primary</button>
        <button app-button intent="secondary">Secondary</button>
        <button app-button intent="success">Success</button>
        <button app-button intent="warning">Warning</button>
        <button app-button intent="danger">Danger</button>
      </div>
    `,
  }),
};

export const AllAppearances: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <button app-button appearance="solid">Solid</button>
        <button app-button appearance="outline">Outline</button>
        <button app-button appearance="ghost">Ghost</button>
        <button app-button appearance="soft">Soft</button>
        <button app-button appearance="link">Link</button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <button app-button size="xs">Extra Small</button>
        <button app-button size="sm">Small</button>
        <button app-button size="md">Medium</button>
        <button app-button size="lg">Large</button>
      </div>
    `,
  }),
};
