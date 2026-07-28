import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
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
    applicationConfig({
      providers: [provideRouter([])]
    }),
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
      <div style="max-width: 340px;">
        <ui-listing-card [listing]="listing">
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
      price: 1250000,
      availability: 'IN_STOCK',
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
