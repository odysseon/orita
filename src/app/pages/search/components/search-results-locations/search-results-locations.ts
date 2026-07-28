import { Component, input, output } from '@angular/core';
import {
  List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd,
} from '../../../../shared/ui/surfaces/list/list';
import { FollowButton } from '../../../../shared/ui/actions/follow-button/follow-button';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { EmptyState } from '../../../../shared/empty-state/empty-state';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-search-results-locations',
  standalone: true,
  imports: [List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd, FollowButton, Button, EmptyState, LucideMapPin],
  template: `
    @if (items().length) {
    <section class="section">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center">
        <h2 class="section__title">Locations</h2>
        @if (total() >= 5) {
          <button app-button appearance="ghost" size="sm" class="btn-text" (click)="viewAll.emit()">See all</button>
        }
      </div>
      <ui-list [bordered]="false" [radius]="false" [dividers]="true">
        @for (loc of items(); track loc.id || loc.externalId) {
        <label uiListItem>
          <div uiListItemStart>
            <svg lucideMapPin aria-hidden="true" style="color: var(--text-muted); width: 20px; height: 20px"></svg>
          </div>
          <div uiListItemContent>
            <div uiListItemTitle class="truncate">{{ loc.name || loc.formattedAddress || 'Location' }}</div>
            @if (loc.formattedAddress && loc.formattedAddress !== loc.name) {
            <div uiListItemDescription class="truncate">{{ loc.formattedAddress }}</div>
            }
          </div>
          <div uiListItemEnd>
            <ui-follow-button
              [isFollowed]="loc.isFollowed ?? false"
              (toggle)="followToggle.emit({ id: loc.id || loc.externalId, wantToFollow: $event })"
            ></ui-follow-button>
          </div>
        </label>
        }
      </ui-list>
    </section>
    }
    @if (items().length === 0 && showEmptyState()) {
    <ui-empty-state title="No locations found" description="We couldn't find any locations matching your search."></ui-empty-state>
    }
  `,
})
export class SearchResultsLocations {
  items = input<any[]>([]);
  total = input<number>(0);
  showEmptyState = input<boolean>(true);

  followToggle = output<{ id: string | undefined; wantToFollow: boolean }>();
  viewAll = output<void>();
}
