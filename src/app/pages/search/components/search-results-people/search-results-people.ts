import { Component, input, output } from '@angular/core';
import { List, ListItem, ListItemContent, ListItemEnd } from 'ur-ui';
import { UserIdentity } from '../../../../shared/ui/identity/user-identity/user-identity';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { Button } from 'ur-ui';
import { EmptyState } from '../../../../shared/empty-state/empty-state';

@Component({
  selector: 'app-search-results-people',
  imports: [List, ListItem, ListItemContent, ListItemEnd, UserIdentity, FollowButton, Button, EmptyState],
  template: `
    @if (items().length) {
    <section class="section">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center">
        <h2 class="section__title">People</h2>
        @if (total() > 5) {
          <button app-button appearance="ghost" size="sm" class="btn-text" (click)="viewAll.emit()">See all</button>
        }
      </div>
      <ui-list [bordered]="false" [radius]="false" [dividers]="true">
        @defer (on viewport; prefetch on idle) {
          @for (item of items(); track item.id) {
            <label uiListItem>
              <div uiListItemContent>
                <ui-user-identity
                  [user]="{
                    id: item.id,
                    username: item.username || item.slug || item.id,
                    displayName: item.displayName || item.name || item.username || 'Unknown',
                    avatarUrl: item.avatarUrl,
                  }"
                />
              </div>
              <div uiListItemEnd>
                <ui-follow-button
                  [isFollowed]="item.isFollowed"
                  (toggle)="followToggle.emit({ id: item.id, wantToFollow: $event })"
                />
              </div>
            </label>
          }
        } @placeholder {
          <div style="padding: var(--size-16);">Loading people...</div>
        }
      </ui-list>
    </section>
    }
    @if (items().length === 0 && showEmptyState()) {
      <ui-empty-state
        title="No people found"
        description="We couldn't find anyone matching your search."
      >
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
  viewAll = output<void>();
}
