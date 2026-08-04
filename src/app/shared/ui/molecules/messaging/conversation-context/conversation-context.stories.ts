import { Meta, StoryObj } from '@storybook/angular';
import { ConversationContext } from './conversation-context';

const meta: Meta<ConversationContext> = {
  title: 'Molecules/Messaging/ConversationContext',
  component: ConversationContext,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 31.25rem; padding: 1rem; background: var(--surface-page); display: flex; flex-direction: column; gap: 1rem;">
        <ui-conversation-context [anchor]="anchor" />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<ConversationContext>;

export const ListingContext: Story = {
  args: {
    anchor: {
      id: 'a-101',
      listingId: 'l-901',
      title: 'Sony PlayStation 5 Disc Edition',
      subtitle: '₦750,000',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=200'
    }
  }
};

export const BusinessContext: Story = {
  args: {
    anchor: {
      id: 'a-202',
      businessId: 'b-302',
      title: 'Odysseo Express Delivery',
      subtitle: 'Verified Merchant',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200'
    }
  }
};
