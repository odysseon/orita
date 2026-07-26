import { Meta, StoryObj } from '@storybook/angular';
import { Container } from './container';

const meta: Meta<Container> = {
  title: 'Layouts/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'fluid'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-container [size]="size">
        <div style="background: var(--surface-card); border: 1px dashed var(--border-default); padding: var(--size-24); text-align: center; border-radius: var(--radius-md);">
          Container Content
        </div>
      </ui-container>
    `,
  }),
};

export default meta;
type Story = StoryObj<Container>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};
