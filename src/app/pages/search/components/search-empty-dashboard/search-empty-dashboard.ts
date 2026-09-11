import { Component, input, output } from '@angular/core';
import {
  List, ListItem, ListItemContent, ListItemEnd,
} from '@odysseon/ur-ui';
import { BusinessIdentity } from '../../../../shared/ui/identity/business-identity/business-identity';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { RecentSearches } from '../recent-searches/recent-searches';
import { TrendingCategories } from '../trending-categories/trending-categories';
import { Skeleton } from '@odysseon/ur-ui';

@Component({
  selector: 'app-search-empty-dashboard',
  standalone: true,
  imports: [List, ListItem, ListItemContent, ListItemEnd, BusinessIdentity, FollowButton, RecentSearches, TrendingCategories, Skeleton],
  template: `
    <div class="empty-state-dashboard">
      <div class="recent-searches">
        <section class="section">
          <h2 class="section__title">Recent Searches</h2>
          <app-recent-searches
            [searches]="recentSearches()"
            (recentSelected)="recentSelected.emit($event)"
          />
        </section>
      </div>

      <div class="trending-section">
        <section class="section">
          <h2 class="section__title">Trending Categories</h2>
          <app-trending-categories
            [categories]="categories()?.slice(0, 6) || []"
            (categorySelected)="categorySelected.emit($event)"
          />
        </section>
      </div>

      <div class="popular-businesses-section">
        <section class="section">
          <h2 class="section__title">Popular Businesses</h2>
          <ui-list [bordered]="false" [radius]="false" [dividers]="true">
            @if (popularBusinessesLoading()) {
              <app-skeleton class="biz-card-skeleton"></app-skeleton>
              <app-skeleton class="biz-card-skeleton"></app-skeleton>
            } @else {
              @for (biz of popularBusinesses(); track biz.id) {
              <label uiListItem>
                <div uiListItemContent>
                  <ui-business-identity [business]="biz"></ui-business-identity>
                </div>
                <div uiListItemEnd>
                  <ui-follow-button
                    [isFollowed]="biz.isFollowed ?? false"
                    (toggle)="followToggle.emit({ type: 'business', id: biz.id, wantToFollow: $event })"
                  ></ui-follow-button>
                </div>
              </label>
              }
            }
          </ui-list>
        </section>
      </div>
    </div>
  `,
})
export class SearchEmptyDashboard {
  recentSearches = input<string[]>([]);
  categories = input<any[] | null>(null);
  popularBusinesses = input<any[]>([]);
  popularBusinessesLoading = input<boolean>(false);

  recentSelected = output<string>();
  categorySelected = output<string>();
  followToggle = output<{ type: string; id: string; wantToFollow: boolean }>();
}
