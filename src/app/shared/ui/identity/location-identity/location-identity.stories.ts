import { Meta, StoryObj } from '@storybook/angular';
import { LocationIdentity } from './location-identity';

const meta: Meta<LocationIdentity> = {
  title: 'Molecules/Identity/LocationIdentity',
  component: LocationIdentity,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    showDetails: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<LocationIdentity>;

const mockLocation = {
  id: 'l1',
  name: 'Bodija',
  state: 'Oyo',
  country: 'Nigeria'
};

export const Default: Story = {
  args: {
    location: mockLocation,
    size: 'md',
    showDetails: true
  }
};

export const Large: Story = {
  args: {
    location: mockLocation,
    size: 'lg',
    showDetails: true
  }
};

export const SmallWithoutDetails: Story = {
  args: {
    location: mockLocation,
    size: 'sm',
    showDetails: false
  }
};

export const NameOnly: Story = {
  args: {
    location: {
      id: 'l2',
      name: 'Lagos'
    },
    size: 'md',
    showDetails: true
  }
};
