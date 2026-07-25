import { Meta, StoryObj } from '@storybook/angular';
import { ListingIdentity } from './listing-identity';

const meta: Meta<ListingIdentity> = {
  title: 'Molecules/Identity/ListingIdentity',
  component: ListingIdentity,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    showPrice: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<ListingIdentity>;

const mockListing = {
  id: 'lst1',
  title: 'Vintage Leather Jacket',
  imageUrl: 'https://i.pravatar.cc/150?u=jacket',
  price: '₦25,000'
};

export const Default: Story = {
  args: {
    listing: mockListing,
    size: 'md',
    showPrice: true
  }
};

export const Large: Story = {
  args: {
    listing: mockListing,
    size: 'lg',
    showPrice: true
  }
};

export const SmallWithoutPrice: Story = {
  args: {
    listing: mockListing,
    size: 'sm',
    showPrice: false
  }
};
