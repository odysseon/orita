import { Meta, StoryObj } from '@storybook/angular';
import { BusinessIdentity } from './business-identity';

const meta: Meta<BusinessIdentity> = {
  title: 'Molecules/Identity/BusinessIdentity',
  component: BusinessIdentity,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    showCategory: { control: 'boolean' },
    verificationStatus: {
      control: 'radio',
      options: ['verified', 'unverified']
    }
  }
};

export default meta;
type Story = StoryObj<BusinessIdentity>;

const mockBusiness = {
  id: 'b1',
  name: 'Nike Ibadan',
  logoUrl: 'https://i.pravatar.cc/150?u=nike',
  category: 'Sportswear'
};

export const Default: Story = {
  args: {
    business: mockBusiness,
    size: 'md',
    showCategory: true,
    verificationStatus: 'unverified'
  }
};

export const Verified: Story = {
  args: {
    business: mockBusiness,
    size: 'md',
    showCategory: true,
    verificationStatus: 'verified'
  }
};

export const Large: Story = {
  args: {
    business: mockBusiness,
    size: 'lg',
    showCategory: true,
    verificationStatus: 'verified'
  }
};

export const SmallWithoutCategory: Story = {
  args: {
    business: mockBusiness,
    size: 'sm',
    showCategory: false,
    verificationStatus: 'unverified'
  }
};
