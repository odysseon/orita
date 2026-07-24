import { Meta, StoryObj } from '@storybook/angular';
import { BusinessCard } from './business-card';
import { FollowButton } from '../../../actions/follow-button/follow-button';

const meta: Meta<BusinessCard> = {
  title: 'Organisms/Cards/BusinessCard',
  component: BusinessCard,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [FollowButton],
    },
    template: `
      <div style="max-width: 500px;">
        <ui-business-card [business]="business" [coverUrl]="coverUrl">
          <div card-description>
            We sell the best vintage leather jackets in town. Visit our store to find your perfect fit.
          </div>
          <div card-stats style="display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary);">
            <span><strong style="color: var(--text-primary);">1.2k</strong> Followers</span>
            <span><strong style="color: var(--text-primary);">45</strong> Listings</span>
          </div>
          <!-- Actions Slot -->
          <div card-actions>
            <ui-follow-button [isFollowed]="false" fullWidth="true"></ui-follow-button>
          </div>
        </ui-business-card>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<BusinessCard>;

export const Default: Story = {
  args: {
    business: {
      id: 'biz1',
      name: 'Vintage Leathers',
      logoUrl: 'https://i.pravatar.cc/150?u=vintage',
      category: 'Clothing Store',
      isVerified: true
    },
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  }
};

export const WithoutCover: Story = {
  args: {
    business: {
      id: 'biz2',
      name: 'Coffee Co.',
      logoUrl: 'https://i.pravatar.cc/150?u=coffee',
      category: 'Cafe',
      isVerified: false
    },
    coverUrl: null
  }
};
