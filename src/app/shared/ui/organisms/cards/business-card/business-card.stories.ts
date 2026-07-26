import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { BusinessCard } from './business-card';
import { ShareService } from '../../../../../core/services/share.service';

class MockShareService {
  async share(data: any) {
    console.log('Share clicked in Storybook:', data);
  }
}

const meta: Meta<BusinessCard> = {
  title: 'Organisms/Cards/BusinessCard',
  component: BusinessCard,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])]
    }),
    moduleMetadata({
      providers: [
        { provide: ShareService, useClass: MockShareService }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <ui-business-card [business]="business" [coverUrl]="coverUrl">
          <div card-description>
            We sell the best vintage leather jackets in town. Visit our store to find your perfect fit.
          </div>
          <div card-stats style="display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
            <span><strong style="color: var(--text-primary);">1.2k</strong> Followers</span>
            <span><strong style="color: var(--text-primary);">45</strong> Listings</span>
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
      slug: 'vintage-leathers',
      logoUrl: 'https://i.pravatar.cc/150?u=vintage',
      category: 'Clothing Store',
      isVerified: true,
      isFollowed: false
    },
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  }
};

export const WithoutCover: Story = {
  args: {
    business: {
      id: 'biz2',
      name: 'Coffee Co.',
      slug: 'coffee-co',
      logoUrl: 'https://i.pravatar.cc/150?u=coffee',
      category: 'Cafe',
      isVerified: false,
      isFollowed: true
    },
    coverUrl: null
  }
};
