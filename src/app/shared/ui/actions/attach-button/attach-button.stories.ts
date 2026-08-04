import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LucidePaperclip } from '@lucide/angular';
import { AttachButton } from './attach-button';
import { ATTACH_BUTTON_I18N } from './attach-button.config';
import { Button } from '../../atoms/button/button';

const meta: Meta<AttachButton> = {
  title: 'Actions/AttachButton',
  component: AttachButton,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LucidePaperclip, Button],
      providers: [
        {
          provide: ATTACH_BUTTON_I18N,
          useValue: {
            attach: 'Attach file',
          },
        },
      ],
    }),
  ],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button shows a loading state',
    },
    appearance: {
      control: 'select',
      options: ['ghost', 'solid', 'outline'],
      description: 'Button appearance variant',
    },
  },
  args: {
    disabled: false,
    loading: false,
    appearance: 'ghost',
  },
  render: (args) => ({
    props: {
      ...args,
      onAttach: () => console.log('Attach clicked'),
    },
    template: `
      <ui-attach-button
        [disabled]="disabled"
        [loading]="loading"
        [appearance]="appearance"
        (attach)="onAttach()"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<AttachButton>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const SolidAppearance: Story = {
  args: {
    appearance: 'solid',
  },
};

export const OutlineAppearance: Story = {
  args: {
    appearance: 'outline',
  },
};

export const WithCustomI18n: Story = {
  decorators: [
    moduleMetadata({
      imports: [LucidePaperclip, Button],
      providers: [
        {
          provide: ATTACH_BUTTON_I18N,
          useValue: {
            attach: 'Upload file',
          },
        },
      ],
    }),
  ],
};

export const Interactive: Story = {
  render: (args) => ({
    props: {
      ...args,
      onAttach: () => console.log('Attach clicked'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--size-20); padding: var(--size-20); align-items: center;">
        <div style="display: flex; gap: var(--size-20); align-items: center; flex-wrap: wrap;">
          <ui-attach-button
            [disabled]="disabled"
            [loading]="loading"
            [appearance]="appearance"
            (attach)="onAttach()"
          />
        </div>
        <div style="font-size: var(--size-14); color: #666;">
          <p>Click the button to trigger the attach event</p>
          <p style="margin-top: var(--size-8);">Current state:
            <strong>{{ disabled ? 'Disabled' : 'Enabled' }}</strong> |
            <strong>{{ loading ? 'Loading' : 'Idle' }}</strong> |
            Appearance: <strong>{{ appearance }}</strong>
          </p>
        </div>
      </div>
    `,
  }),
};

export const InMessageComposer: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--size-12); padding: var(--size-16); background: #f8f9fa; border-radius: var(--size-12); max-width: 31.25rem; align-items: center; border: var(--size-1) solid #e9ecef;">
        <ui-attach-button (attach)="console.log('Attach clicked')" />
        <input
          type="text"
          placeholder="Type a message..."
          style="flex: 1; padding: var(--size-8) var(--size-12); border: var(--size-1) solid #dee2e6; border-radius: var(--size-6); font-size: var(--size-14);"
        />
        <button
          style="padding: var(--size-8) var(--size-20); background: #0066ff; color: white; border: none; border-radius: var(--size-6); cursor: pointer; font-size: var(--size-14); font-weight: 500;"
        >
          Send
        </button>
      </div>
    `,
  }),
};
