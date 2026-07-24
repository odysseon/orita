import { Meta, StoryObj } from '@storybook/angular';
import { UserIdentity } from '../../molecules/identity/user-identity/user-identity';
import { BusinessIdentity } from '../../molecules/identity/business-identity/business-identity';
import { FollowButton } from '../../actions/follow-button/follow-button';
import { ListItem, ListItemStart, ListItemContent, ListItemEnd, List } from '../../surfaces/list/list';

const meta: Meta = {
  title: 'Organisms/SearchResults/Recipes',
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [UserIdentity, BusinessIdentity, FollowButton, ListItem, ListItemStart, ListItemContent, ListItemEnd, List]
    },
    template: `
      <ui-list style="max-width: 450px;">
        
        <div style="padding: var(--size-12) var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-md); border-bottom: var(--size-1) solid var(--border-subtle);">
          Select Users
        </div>
        
        <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
          <div uiListItemStart style="display: flex; align-items: center;">
            <input type="radio" class="app-radio" name="user-selection" />
          </div>
          <div uiListItemContent>
            <ui-user-identity [user]="user" size="sm"></ui-user-identity>
          </div>
          <div uiListItemEnd>
            <ui-follow-button [isFollowed]="false" display="icon" size="sm"></ui-follow-button>
          </div>
        </label>

        <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
          <div uiListItemStart style="display: flex; align-items: center;">
            <input type="radio" class="app-radio" name="user-selection" checked />
          </div>
          <div uiListItemContent>
            <ui-user-identity [user]="user2" size="sm"></ui-user-identity>
          </div>
          <div uiListItemEnd>
            <ui-follow-button [isFollowed]="true" display="icon" size="sm"></ui-follow-button>
          </div>
        </label>

        <div style="padding: var(--size-12) var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-md); border-bottom: var(--size-1) solid var(--border-subtle); border-top: var(--size-1) solid var(--border-subtle);">
          Select Businesses
        </div>

        <label uiListItem [interactive]="true" style="cursor: pointer; padding: var(--size-12) var(--size-16);">
          <div uiListItemStart style="display: flex; align-items: center;">
            <input type="radio" class="app-radio" name="business-selection" />
          </div>
          <div uiListItemContent>
            <ui-business-identity [business]="business" size="sm"></ui-business-identity>
          </div>
          <div uiListItemEnd>
            <ui-follow-button [isFollowed]="false" display="icon" size="sm"></ui-follow-button>
          </div>
        </label>

      </ui-list>
    `
  })
};

export default meta;
type Story = StoryObj;

export const GenericIdentities: Story = {
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
    }
  }
};
