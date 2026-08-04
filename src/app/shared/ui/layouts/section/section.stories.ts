import { Meta, StoryObj } from '@storybook/angular';
import { Section } from './section';

const meta: Meta<Section> = {
  title: 'Layouts/Section',
  component: Section,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [title]="title" [description]="description">
        <div style="background: var(--surface-card); height: 100px; border: var(--size-1) dashed var(--border-default); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
          Projected Content Goes Here
        </div>
      </ui-section>
    `,
  }),
};

export default meta;
type Story = StoryObj<Section>;

export const Default: Story = {
  args: {
    title: 'Popular Businesses',
    description: 'Discover trending places near you.',
  },
};
