import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { UserIdentity } from './user-identity';

const meta: Meta<UserIdentity> = {
  title: 'Molecules/Identity/UserIdentity',
  component: UserIdentity,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])]
    })
  ],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    showUsername: { control: 'boolean' },
    metadata: { control: 'text' }
  }
};

export default meta;
type Story = StoryObj<UserIdentity>;

const mockUser = {
  id: 'u1',
  displayName: 'John Doe',
  username: 'johndoe',
  avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
};

export const Default: Story = {
  args: {
    user: mockUser,
    size: 'md',
    showUsername: true
  }
};

export const WithoutUsername: Story = {
  args: {
    user: mockUser,
    size: 'md',
    showUsername: false
  }
};

export const WithMetadata: Story = {
  args: {
    user: mockUser,
    size: 'lg',
    showUsername: true,
    metadata: 'Software Engineer'
  }
};

export const Small: Story = {
  args: {
    user: mockUser,
    size: 'sm',
    showUsername: true
  }
};
