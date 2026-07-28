import { Component, input, output } from '@angular/core';
import {
  List, ListItem, ListItemContent, ListItemEnd,
} from '../../../../shared/ui/surfaces/list/list';
import { BusinessIdentity } from '../../../../shared/ui/identity/business-identity/business-identity';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { Button } from '../../../../shared/ui/atoms/button/button';
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
      </ui-list>
    </section>
    }
    @if (items().length === 0) {
    <ui-empty-state title="No businesses found" description="We couldn't find any businesses matching your search."></ui-empty-state>
    } @else if (items().length < total()) {
    <div style="text-align: center; margin-top: 2rem">
      <button app-button appearance="outline" (click)="loadMore.emit()">Load More</button>
    </div>
    }
  `,
})
export class SearchResultsBusinesses {
  items = input<any[]>([]);
  total = input<number>(0);

  followToggle = output<{ id: string; wantToFollow: boolean }>();
  loadMore = output<void>();
  viewAll = output<void>();
}
