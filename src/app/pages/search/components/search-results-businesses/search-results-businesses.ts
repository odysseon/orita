import { Component, input, output } from '@angular/core';
import {
  List, ListItem, ListItemContent, ListItemEnd,
} from '@odysseon/ur-ui';
import { BusinessIdentity } from '../../../../shared/ui/identity/business-identity/business-identity';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { Button } from '@odysseon/ur-ui';
import { EmptyState } from '../../../../shared/empty-state/empty-state';

@Component({
  selector: 'app-search-results-businesses',
  standalone: true,
  imports: [List, ListItem, ListItemContent, ListItemEnd, BusinessIdentity, FollowButton, Button, EmptyState],
  template: `
    @if (items().length) {
    <section class="section">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center">
        <h2 class="section__title">Businesses</h2>
        @if (total() > 5) {
          <button app-button appearance="ghost" size="sm" class="btn-text" (click)="viewAll.emit()">See all</button>
        }
      </div>
      <ui-list [bordered]="false" [radius]="false" [dividers]="true">
        @defer (on viewport; prefetch on idle) {
          @for (biz of items(); track biz.id) {
          <label uiListItem>
            <div uiListItemContent>
              <ui-business-identity [business]="biz"></ui-business-identity>
            </div>
            <div uiListItemEnd>
              <ui-follow-button
                [isFollowed]="biz.isFollowed ?? false"
                (toggle)="followToggle.emit({ id: biz.id, wantToFollow: $event })"
              ></ui-follow-button>
            </div>
          </label>
          }
        } @placeholder {
          <div style="padding: var(--size-16);">Loading businesses...</div>
        }
      </ui-list>
    </section>
    }
    @if (items().length === 0 && showEmptyState()) {
    <ui-empty-state title="No businesses found" description="We couldn't find any businesses matching your search."></ui-empty-state>
    } @else if (items().length > 0 && items().length < total()) {
    <div style="text-align: center; margin-top: 2rem">
      <button app-button appearance="outline" (click)="loadMore.emit()">Load More</button>
    </div>
    }
  `,
})
export class SearchResultsBusinesses {
  items = input<any[]>([]);
  total = input<number>(0);
  showEmptyState = input<boolean>(true);

  followToggle = output<{ id: string; wantToFollow: boolean }>();
  loadMore = output<void>();
  viewAll = output<void>();
}
