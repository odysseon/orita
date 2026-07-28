import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { ListingSearchResult } from '../../../../shared/ui/organisms/search-results/listing-search-result/listing-search-result';
import { List } from '../../../../shared/ui/surfaces/list/list';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { EmptyState } from '../../../../shared/empty-state/empty-state';

@Component({
  selector: 'app-search-results-listings',
  standalone: true,
  imports: [ListingSearchResult, List, Button, EmptyState],
  templateUrl: './search-results-listings.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchResultsListings {
  items = input<any[]>([]);
  total = input<number>(0);

  saveToggle = output<{ id: string; wantToSave: boolean }>();
  loadMore = output<void>();
  viewAll = output<void>();

  onSaveToggle(id: string, wantToSave: boolean) {
    this.saveToggle.emit({ id, wantToSave });
  }
}
