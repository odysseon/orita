import { Meta, StoryObj } from '@storybook/angular';
import { Inline } from './inline';

const meta: Meta<Inline> = {
  title: 'Layouts/Inline',
  component: Inline,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
    },
    wrap: {
      control: 'boolean',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-inline [gap]="gap" [align]="align" [justify]="justify" [wrap]="wrap" style="background: var(--surface-card); padding: 1rem; border: 1px dashed var(--border-default);">
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 1</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 2</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 3</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 4</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Item 5</div>
      </ui-inline>
    `,
  }),
};

export default meta;
type Story = StoryObj<Inline>;

export const Default: Story = {
  args: {
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: true,
  },
};
