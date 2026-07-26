import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ListingCard } from './listing-card';
import { MessagingFacade } from '../../../../../core/services/messaging.facade';
import { ShareService } from '../../../../../core/services/share.service';

class MockMessagingFacade {
  messageBusiness(businessId: string, payload: any) {
    console.log('Message business clicked in Storybook:', businessId, payload);
  }
}

class MockShareService {
  async share(data: any) {
    console.log('Share clicked in Storybook:', data);
  }
}

const meta: Meta<ListingCard> = {
  title: 'Organisms/Cards/ListingCard',
  component: ListingCard,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: MessagingFacade, useClass: MockMessagingFacade },
        { provide: ShareService, useClass: MockShareService }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 320px;">
        <style>
          .glass-badge {
            position: absolute;
            bottom: 12px;
            left: 12px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-bold);
            padding: 6px 12px;
            border-radius: var(--radius-full);
            z-index: 2;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        </style>
        
        <ui-listing-card [listing]="listing">
          <!-- Media Overlay Slot for custom price badge -->
          <div card-media-overlay>
            <div class="glass-badge">₦1,250,000</div>
          </div>
          
          <!-- Meta Slot -->
          <div card-meta>
            Lagos, Nigeria • Posted 2h ago
          </div>
        </ui-listing-card>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<ListingCard>;

export const Default: Story = {
  args: {
    listing: {
      id: 'lst1',
      slug: 'vintage-leather-jacket',
      title: 'Vintage Classic Leather Jacket (Brown) - Excellent Condition',
      coverUrl: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=600',
      isSaved: true,
      business: {
        id: 'biz1',
        name: 'Vintage Leathers',
        slug: 'vintage-leathers',
        logoUrl: 'https://i.pravatar.cc/150?u=vintage',
        isVerified: true
      }
    }
  }
};
