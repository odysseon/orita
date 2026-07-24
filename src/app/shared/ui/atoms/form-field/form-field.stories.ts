import { Meta, StoryObj } from '@storybook/angular';
import { AppFormField } from './form-field';

const meta: Meta<AppFormField> = {
  title: 'Atoms/FormField',
  component: AppFormField,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  render: (args) => ({
    props: {
      ...args,
      ariaDescribedBy: () => {
        const ids: string[] = [];
        if (args.description) ids.push(`${args.fieldId}-description`);
        if (args.invalid && args.errorMessage) ids.push(`${args.fieldId}-error`);
        else if (args.hint) ids.push(`${args.fieldId}-hint`);
        return ids.length ? ids.join(' ') : null;
      },
    },
    template: `
      <app-form-field
        [label]="label"
        [fieldId]="fieldId"
        [description]="description"
        [hint]="hint"
        [errorMessage]="errorMessage"
        [orientation]="orientation"
        [required]="required"
        [optional]="optional"
        [disabled]="disabled"
        [invalid]="invalid"
        [hideLabel]="hideLabel"
      >
        <input 
          [id]="fieldId" 
          type="text" 
          placeholder="Placeholder input..." 
          class="field__input"
          [disabled]="disabled"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-invalid]="invalid ? 'true' : null"
        >
      </app-form-field>
    `,
  }),
};

export default meta;
type Story = StoryObj<AppFormField>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    fieldId: 'email',
    description: 'We will use this to contact you.',
    hint: 'Must be a valid email address.',
    errorMessage: 'Email is required.',
    orientation: 'vertical',
    required: false,
    optional: false,
    disabled: false,
    invalid: false,
    hideLabel: false,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    label: 'Password',
    fieldId: 'password',
    required: true,
  },
};

export const Optional: Story = {
  args: {
    ...Default.args,
    label: 'Phone Number',
    fieldId: 'phone',
    optional: true,
  },
};

export const InvalidWithError: Story = {
  args: {
    ...Default.args,
    invalid: true,
  },
};

export const HorizontalLayout: Story = {
  args: {
    ...Default.args,
    orientation: 'horizontal',
  },
};

export const HiddenLabel: Story = {
  args: {
    ...Default.args,
    label: 'Search',
    fieldId: 'search',
    hideLabel: true,
    description: '',
    hint: '',
  },
};
