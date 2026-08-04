import { Meta, StoryObj } from '@storybook/angular';
import { SaveButton } from './save-button';

const meta: Meta<SaveButton> = {
  title: 'Actions/SaveButton',
  component: SaveButton,
  tags: ['autodocs'],
  argTypes: {
    isSaved: { control: 'boolean' },
    appearance: { control: 'select', options: ['glass', 'ghost', 'soft', 'outline'] },
    toggle: { action: 'toggled' },
  },
  render: (args) => ({
    props: args,
    template: `
      <!-- If glass, show over a background to test the blur effect -->
      <div [style.padding]="appearance === 'glass' ? 'var(--size-32)' : '0'"
           [style.background]="appearance === 'glass' ? 'url(https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=600) center/cover' : 'transparent'"
           [style.border-radius]="appearance === 'glass' ? 'var(--radius-lg)' : 'none'">

        <ui-save-button
          [isSaved]="isSaved"
          [appearance]="appearance"
          (toggle)="toggle($event)"
        ></ui-save-button>

      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SaveButton>;

export const GhostUnsaved: Story = {
  args: {
    isSaved: false,
    appearance: 'ghost',
  },
};

export const GhostSaved: Story = {
  args: {
    isSaved: true,
    appearance: 'ghost',
  },
};
