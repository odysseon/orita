import { Meta, StoryObj } from '@storybook/angular';
import { ListingCard } from './listing-card';
import { SaveButton } from '../../../actions/save-button/save-button';

const meta: Meta<ListingCard> = {
  title: 'Organisms/Cards/ListingCard',
  component: ListingCard,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SaveButton],
    },
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
        
        <a class="ui-listing-card">
          <ui-listing-card [listing]="listing">
            <!-- Media Overlay Slot -->
            <div card-media-overlay>
              <ui-save-button [isSaved]="false" style="position: absolute; top: 12px; right: 12px; z-index: 2;"></ui-save-button>
              <div class="glass-badge">₦1,250,000</div>
            </div>
            
            <!-- Meta Slot -->
            <div card-meta>
              Vintage Leathers • Lagos
            </div>
          </ui-listing-card>
        </a>
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
      coverUrl: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=600'
    }
  }
};
