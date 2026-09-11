import { Component, inject } from '@angular/core';
import { LucideX, LucideMapPin } from '@lucide/angular';
import { SearchStore } from './search.store';
import { SearchFilterState } from './components/search-filters/search-filters';
import { SearchHeader } from '../../shared/ui/organisms/search-header/search-header';
import { ScrollHideDirective } from 'ur-ui';
import { Tabs, TabList, TabTrigger } from 'ur-ui';
import { SearchFiltersComponent } from './components/search-filters/search-filters';
import { SeoComponent } from '../../shared/seo/seo.component';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { Button } from 'ur-ui';

import { SearchEmptyDashboard } from './components/search-empty-dashboard/search-empty-dashboard';
import { SearchResultsListings } from './components/search-results-listings/search-results-listings';
import { SearchResultsBusinesses } from './components/search-results-businesses/search-results-businesses';
import { SearchResultsPeople } from './components/search-results-people/search-results-people';
import { SearchResultsLocations } from './components/search-results-locations/search-results-locations';
import { SearchResultsTours } from './components/search-results-tours/search-results-tours';

@Component({
  selector: 'app-search',
  imports: [
    LucideX,
    LucideMapPin,
    Tabs,
    TabList,
    TabTrigger,
    SearchHeader,
    ScrollHideDirective,
    SearchFiltersComponent,
    SeoComponent,
    EmptyState,
    Button,
    SearchEmptyDashboard,
    SearchResultsListings,
    SearchResultsBusinesses,
    SearchResultsPeople,
    SearchResultsLocations,
    SearchResultsTours,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
  providers: [SearchStore]
})
export class Search {
  readonly store = inject(SearchStore);

  onSearchInputString(val: string) {
    this.store.rawQuery.set(val);
  }
  clearSearch() {
    this.store.rawQuery.set('');
    this.store.updateUrl({ limit: null });
  }
  setSearchType(type: 'all' | 'people' | 'listing' | 'business' | 'location' | 'tour') {
    this.store.updateUrl({ tab: type, limit: null });
  }
  setCategory(categoryId: string | null) {
    this.store.updateUrl({ categoryId, limit: null });
  }
  clearCategory() {
    this.store.updateUrl({ categoryId: null, limit: null });
  }
  loadMore() {
    this.store.updateUrl({ limit: this.store.appliedLimit() + 20 });
  }
  applyRecentSearch(query: string) {
    this.store.rawQuery.set(query);
  }
  openFilters() {
    this.store.isFiltersOpen.set(true);
  }

  onApplyFilters(filters: SearchFilterState) {
    this.store.updateUrl({
      lat: filters.lat || null,
      lng: filters.lng || null,
      locationName: filters.locationName || null,
      radius: filters.radius !== 10 ? filters.radius : null,
      categoryId: filters.categoryId || null,
      sort: filters.sort !== 'relevance' ? filters.sort : null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
      filter: filters.filters || null,
      limit: null,
    });
  }
}
