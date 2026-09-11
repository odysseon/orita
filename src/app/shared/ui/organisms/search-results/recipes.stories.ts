import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { UserIdentity } from '../../identity/user-identity/user-identity';
import { BusinessIdentity } from '../../identity/business-identity/business-identity';
import { ListingSearchResult } from './listing-search-result/listing-search-result';
import { CheckboxDirective } from '@odysseon/ur-ui';
import { FollowButton } from '../../actions/follow-button/follow-button';
import { ListItem, ListItemStart, ListItemContent, ListItemEnd, List } from '@odysseon/ur-ui';

const meta: Meta = {
  title: 'Organisms/SearchResults/Recipes',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} }
      ]
    }),
    moduleMetadata({
      imports: [
        UserIdentity, BusinessIdentity, ListingSearchResult, 
        FollowButton, CheckboxDirective,
        ListItem, ListItemStart, ListItemContent, ListItemEnd, List
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 31.25rem; font-family: sans-serif;">
        <ui-list [bordered]="true" [dividers]="true">
          
          <div style="padding: var(--size-12) var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-md); border-bottom: var(--size-1) solid var(--border-subtle); background: var(--surface-container-low);">
            1. User Selection (Ghost Circular Checkboxes)
          </div>
          
          <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
            <div uiListItemContent>
              <ui-user-identity [user]="user" size="sm" [interactive]="false"></ui-user-identity>
            </div>
            <div uiListItemEnd>
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" checked />
            </div>
          </label>

          <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
            <div uiListItemContent>
              <ui-user-identity [user]="user2" size="sm" [interactive]="false"></ui-user-identity>
            </div>
            <div uiListItemEnd>
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" />
            </div>
          </label>

          <div style="padding: var(--size-12) var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-md); border-bottom: var(--size-1) solid var(--border-subtle); border-top: var(--size-1) solid var(--border-subtle); background: var(--surface-container-low);">
            2. Business Identity Recipe
          </div>

          <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
            <div uiListItemContent>
              <ui-business-identity [business]="business" size="sm" [interactive]="false"></ui-business-identity>
            </div>
            <div uiListItemEnd>
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" checked />
            </div>
          </label>

          <div style="padding: var(--size-12) var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-md); border-bottom: var(--size-1) solid var(--border-subtle); border-top: var(--size-1) solid var(--border-subtle); background: var(--surface-container-low);">
            3. Specialized Listing Results (ui-listing-search-result)
          </div>

          <ui-listing-search-result [listing]="listing1">
            <input result-action type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" checked />
          </ui-listing-search-result>

          <ui-listing-search-result [listing]="listing2">
            <input result-action type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" />
          </ui-listing-search-result>

        </ui-list>
      </div>
    `
  })
};

export default meta;
type Story = StoryObj;

export const ComprehensiveRegressionGrid: Story = {
  args: {
    user: {
      id: 'u1',
      displayName: 'Tomiwa',
      username: 'tomiwa',
      avatarUrl: 'https://i.pravatar.cc/150?u=1'
    },
    user2: {
      id: 'u2',
      displayName: 'Jane Doe',
      username: 'janedoe',
      avatarUrl: 'https://i.pravatar.cc/150?u=2'
    },
    business: {
      id: 'b1',
      name: 'Vintage Leathers',
      logoUrl: 'https://i.pravatar.cc/150?u=3',
      category: 'Clothing'
    },
    listing1: {
      id: 'l1',
      title: 'Apple iPad Pro M2 12.9" (Wi-Fi, 256GB, Silver)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200',
      price: 1450000,
      availability: 'in-stock',
    },
    listing2: {
      id: 'l2',
      title: 'Sony Alpha a7 IV Mirrorless Camera Body Only',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200',
      price: 2950000,
      availability: 'out-of-stock',
    }
  }
};
