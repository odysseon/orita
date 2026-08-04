import { Meta, StoryObj } from '@storybook/angular';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from './header';
import { Button } from '../../atoms/button/button';

const meta: Meta<Header> = {
  title: 'Layouts/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    sticky: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [HeaderStart, HeaderCenter, HeaderEnd, Button],
    },
    template: `
      <ui-header [sticky]="sticky" [bordered]="bordered">
        <div uiHeaderStart>
          <button app-button appearance="ghost" size="sm">Back</button>
        </div>
        <div uiHeaderCenter>
          Page Title
        </div>
        <div uiHeaderEnd>
          <button app-button size="sm">Save</button>
        </div>
      </ui-header>
      <div style="height: calc(var(--size-10) * 50); padding: 2rem; background: var(--surface-container); margin-top: 1rem;">
        <p>Scroll down to see the sticky behavior (if enabled).</p>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<Header>;

export const Default: Story = {
  args: {
    sticky: false,
    bordered: true,
  },
};
