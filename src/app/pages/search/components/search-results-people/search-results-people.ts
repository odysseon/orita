import { Component, input, output } from '@angular/core';
import {
  List, ListItem, ListItemContent, ListItemEnd,
} from '../../../../shared/ui/surfaces/list/list';
import { UserIdentity } from '../../../../shared/ui/identity/user-identity/user-identity';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { EmptyState } from '../../../../shared/empty-state/empty-state';

@Component({
  selector: 'app-search-results-people',
  imports: [List, ListItem, ListItemContent, ListItemEnd, UserIdentity, FollowButton, Button, EmptyState],
  template: `
    <ui-list [bordered]="false" [radius]="false" [dividers]="true">
      @for (user of items(); track user.id) {
      <label uiListItem>
        <div uiListItemContent>
          <ui-user-identity
            [user]="{ id: user.id, displayName: $any(user).name || $any(user).displayName || $any(user).username || 'Unknown', username: $any(user).username || $any(user).slug || user.id, avatarUrl: user.avatarUrl }"
          ></ui-user-identity>
        </div>
        <div uiListItemEnd>
          <ui-follow-button
            [isFollowed]="user.isFollowed ?? false"
            (toggle)="followToggle.emit({ id: user.id, wantToFollow: $event })"
          ></ui-follow-button>
        </div>
      </label>
      }
    </ui-list>
    @if (items().length === 0 && showEmptyState()) {
    <ui-empty-state title="No people found" description="We couldn't find anyone matching your search.">
      <button app-button appearance="outline" (click)="clearSearch.emit()">Clear Search</button>
    </ui-empty-state>
    } @else if (items().length > 0 && items().length < total()) {
    <div style="text-align: center; margin-top: 2rem">
      <button app-button appearance="outline" (click)="loadMore.emit()">Load More</button>
    </div>
    }
  `,
})
export class SearchResultsPeople {
  items = input<any[]>([]);
  total = input<number>(0);
  showEmptyState = input<boolean>(true);

  followToggle = output<{ id: string; wantToFollow: boolean }>();
  loadMore = output<void>();
  clearSearch = output<void>();
}
