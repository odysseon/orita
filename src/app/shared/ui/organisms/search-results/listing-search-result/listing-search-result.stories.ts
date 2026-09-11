import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { ListingSearchResult } from './listing-search-result';
import { SaveButton } from '../../../actions/save-button/save-button';
import { List } from 'ur-ui';

const meta: Meta<ListingSearchResult> = {
  title: 'Organisms/SearchResults/ListingSearchResult',
  component: ListingSearchResult,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])]
    })
  ],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SaveButton, List]
    },
    template: `
      <ui-list style="max-width: 25rem; display: block;">
        <ui-listing-search-result [listing]="listing"></ui-listing-search-result>
      </ui-list>
    `
  })
};

export default meta;
type Story = StoryObj<ListingSearchResult>;

export const Default: Story = {
  args: {
    listing: {
      id: 'l1',
      title: 'Vintage Leather Jacket (Brown, Size M)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=200',
      price: 45000,
      availability: 'in-stock',
      isSaved: false
    }
  }
};

export const OutOfStock: Story = {
  args: {
    listing: {
      id: 'l2',
      title: 'Sony PlayStation 5 Console',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=200',
      price: 750000,
      availability: 'out-of-stock',
      isSaved: true
    }
  }
};

export const NoThumbnail: Story = {
  args: {
    listing: {
      id: 'l3',
      title: 'Handcrafted Wooden Table',
      price: 120000,
      availability: 'in-stock',
      isSaved: false
    }
  }
};
