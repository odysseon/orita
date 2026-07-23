import { Meta, StoryObj } from '@storybook/angular';
import { Grid } from './grid';

const meta: Meta<Grid> = {
  title: 'Layouts/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    cols: {
      control: 'text',
      description: 'Accepts a number or a responsive string (e.g. "1 md:2 lg:3")',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-grid [gap]="gap" [cols]="cols">
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">1</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">2</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">3</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">4</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">5</div>
        <div style="background: var(--clr-primary-container); color: var(--clr-on-primary-container); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">6</div>
      </ui-grid>
    `,
  }),
};

export default meta;
type Story = StoryObj<Grid>;

export const ThreeColumnsFixed: Story = {
  args: {
    cols: 3,
    gap: 'md',
  },
};

export const ResponsiveColumns: Story = {
  args: {
    cols: '1 md:2 lg:4',
    gap: 'md',
  },
};
