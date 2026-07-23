import { Meta, StoryObj } from '@storybook/angular';
import { Stack } from './stack';

const meta: Meta<Stack> = {
  title: 'Layouts/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-stack [gap]="gap" [align]="align" [justify]="justify" style="min-height: 200px; background: var(--surface-card); padding: 1rem; border: 1px dashed var(--border-default);">
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 1</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 2</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 3</div>
      </ui-stack>
    `,
  }),
};

export default meta;
type Story = StoryObj<Stack>;

export const Default: Story = {
  args: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
};
