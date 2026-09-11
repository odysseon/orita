import { Component, input, output } from '@angular/core';
import { StoreTourCard } from '../../../../shared/ui/organisms/cards/store-tour-card/store-tour-card';
import { Grid } from '@odysseon/ur-ui';
import { Button } from '@odysseon/ur-ui';
import { EmptyState } from '../../../../shared/empty-state/empty-state';

@Component({
  selector: 'app-search-results-tours',
  standalone: true,
  imports: [StoreTourCard, Grid, Button, EmptyState],
  template: `
    @if (items().length) {
    <section class="section">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center">
        <h2 class="section__title">Tours</h2>
        @if (total() > 5) {
          <button app-button appearance="ghost" size="sm" class="btn-text" (click)="viewAll.emit()">See all</button>
        }
      </div>
      <ui-grid cols="2 md:3 lg:4" gap="sm">
        @for (tour of items(); track tour.id) {
          <ui-store-tour-card [tour]="tour" />
        }
      </ui-grid>
    </section>
    }
    @if (items().length === 0 && showEmptyState()) {
    <ui-empty-state title="No tours found" description="We couldn't find any tours matching your search.">
      <button app-button appearance="outline" (click)="clearSearch.emit()">Clear Search</button>
    </ui-empty-state>
    } @else if (items().length > 0 && items().length < total()) {
    <div style="text-align: center; margin-top: 2rem">
      <button app-button appearance="outline" (click)="loadMore.emit()">Load More</button>
    </div>
    }
  `,
})
export class SearchResultsTours {
  items = input<any[]>([]);
  total = input<number>(0);
  showEmptyState = input<boolean>(true);

  loadMore = output<void>();
  viewAll = output<void>();
  clearSearch = output<void>();
}
