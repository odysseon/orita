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
      <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px; align-items: center;">
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <ui-attach-button
            [disabled]="disabled"
            [loading]="loading"
            [appearance]="appearance"
            (attach)="onAttach()"
          />
        </div>
        <div style="font-size: 14px; color: #666;">
          <p>Click the button to trigger the attach event</p>
          <p style="margin-top: 8px;">Current state:
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
      <div style="display: flex; gap: 12px; padding: 16px; background: #f8f9fa; border-radius: 12px; max-width: 500px; align-items: center; border: 1px solid #e9ecef;">
        <ui-attach-button (attach)="console.log('Attach clicked')" />
        <input
          type="text"
          placeholder="Type a message..."
          style="flex: 1; padding: 8px 12px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px; outline: none;"
        />
        <button
          style="padding: 8px 20px; background: #0066ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
        >
          Send
        </button>
      </div>
    `,
  }),
};
