import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LucideX, LucideMapPin } from '@lucide/angular';
import { SearchService } from '../../core/services/search.service';
import { ExplorationService } from '../../core/services/exploration.service';
import { CategoryService } from '../../core/services/category.service';
import { LocationService, Location } from '../../core/services/location.service';
import { FollowService, FollowType } from '../../core/services/follow.service';
import { SaveService } from '../../core/services/save.service';
import { SearchFilters } from '../../core/models/search.model';
import { SearchHeader } from '../../shared/ui/organisms/search-header/search-header';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { Tabs, TabList, TabTrigger } from '../../shared/ui/molecules/tabs';
import { SearchFiltersComponent, SearchFilterState } from './components/search-filters/search-filters';
import { SeoComponent } from '../../shared/seo/seo.component';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { Button } from '../../shared/ui/atoms/button/button';
import { Skeleton } from '../../shared/ui/atoms/skeleton/skeleton';

// Sub-components
import { SearchEmptyDashboard } from './components/search-empty-dashboard/search-empty-dashboard';
import { SearchResultsListings } from './components/search-results-listings/search-results-listings';
import { SearchResultsBusinesses } from './components/search-results-businesses/search-results-businesses';
import { SearchResultsPeople } from './components/search-results-people/search-results-people';
import { SearchResultsLocations } from './components/search-results-locations/search-results-locations';
import { SearchResultsTours } from './components/search-results-tours/search-results-tours';

@Component({
  selector: 'app-search',
  imports: [
    LucideX, LucideMapPin,
    Tabs, TabList, TabTrigger,
    SearchHeader, ScrollHideDirective,
    SearchFiltersComponent,
    SeoComponent,
    EmptyState, Button, Skeleton,
    SearchEmptyDashboard,
    SearchResultsListings,
    SearchResultsBusinesses,
    SearchResultsPeople,
    SearchResultsLocations,
    SearchResultsTours,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  #searchService = inject(SearchService);
  #exploration = inject(ExplorationService);
  #categoryService = inject(CategoryService);
  #followService = inject(FollowService);
  #saveService = inject(SaveService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  readonly categories = this.#categoryService.leafCategories;
  readonly queryParamMap = toSignal(this.#route.queryParamMap);

  readonly searchType = computed<'all' | 'people' | 'listing' | 'business' | 'location' | 'tour'>(
    () => (this.queryParamMap()?.get('tab') as any) || 'all',
  );

  readonly searchQuery = computed(() => this.queryParamMap()?.get('q') || '');
  readonly appliedLocationName = computed(() => this.queryParamMap()?.get('locationName') || '');
  readonly appliedLat = computed(() => {
    const queryLat = Number(this.queryParamMap()?.get('lat'));
    return !isNaN(queryLat) && queryLat !== 0 ? queryLat : this.#exploration.activeLocation()?.lat;
  });
  readonly appliedLng = computed(() => {
    const queryLng = Number(this.queryParamMap()?.get('lng'));
    return !isNaN(queryLng) && queryLng !== 0 ? queryLng : this.#exploration.activeLocation()?.lng;
  });
  readonly appliedRadius = computed(() => Number(this.queryParamMap()?.get('radius')) || 15000);
  readonly appliedCategoryId = computed(() => this.queryParamMap()?.get('categoryId') || undefined);
  readonly appliedSort = computed(() => this.queryParamMap()?.get('sort') || 'relevance');
  readonly appliedLimit = computed(() => Number(this.queryParamMap()?.get('limit')) || 20);
  readonly appliedMinPrice = computed(() => {
    const val = this.queryParamMap()?.get('minPrice');
    return val ? Number(val) : undefined;
  });
  readonly appliedMaxPrice = computed(() => {
    const val = this.queryParamMap()?.get('maxPrice');
    return val ? Number(val) : undefined;
  });

  readonly rawQuery = signal(this.#route.snapshot.queryParamMap.get('q') || '');
  readonly isDebouncing = computed(() => this.rawQuery() !== this.searchQuery());
  readonly recentSearches = signal<string[]>(this.loadLocalStorage('orita_recent_searches'));
  readonly isFiltersOpen = signal(false);

  readonly currentFiltersState = computed<SearchFilterState>(() => ({
    locationName: this.appliedLocationName() || null,
    lat: this.appliedLat() || null,
    lng: this.appliedLng() || null,
    radius: this.appliedRadius() || 15000,
    categoryId: this.appliedCategoryId() || null,
    sort: this.appliedSort() || 'relevance',
    minPrice: this.appliedMinPrice() || null,
    maxPrice: this.appliedMaxPrice() || null,
    filters: this.queryParamMap()?.getAll('filter') || null,
  }));

  // Optimistic overrides
  readonly followOverrides = signal<Record<string, boolean>>({});
  readonly saveOverrides = signal<Record<string, boolean>>({});

  // Derived API Parameters
  readonly listingParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'listing' && this.searchType() !== 'all') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName() && !this.appliedCategoryId()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(), lng: this.appliedLng(), radius: this.appliedRadius(),
      categoryId: this.appliedCategoryId(),
      sort: this.appliedSort() !== 'relevance' ? this.appliedSort() : undefined,
      limit: this.searchType() === 'all' ? 5 : this.appliedLimit() !== 20 ? this.appliedLimit() : undefined,
      minPrice: this.appliedMinPrice(), maxPrice: this.appliedMaxPrice(),
      filter: this.queryParamMap()?.getAll('filter') || [],
    };
  });

  readonly businessParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'business' && this.searchType() !== 'all') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName() && !this.appliedCategoryId()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(), lng: this.appliedLng(), radius: this.appliedRadius(),
      categoryId: this.appliedCategoryId(),
      sort: this.appliedSort() !== 'relevance' ? this.appliedSort() : undefined,
      limit: this.searchType() === 'all' ? 5 : this.appliedLimit() !== 20 ? this.appliedLimit() : undefined,
    };
  });

  readonly userParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'people' && this.searchType() !== 'all') return null;
    if (!this.searchQuery().trim()) return null;
    return {
      q: this.searchQuery().trim(),
      limit: this.searchType() === 'all' ? 5 : this.appliedLimit() !== 20 ? this.appliedLimit() : undefined,
    };
  });

  readonly tourParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'tour' && this.searchType() !== 'all') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(), lng: this.appliedLng(), radius: this.appliedRadius(),
      sort: this.appliedSort() !== 'relevance' ? this.appliedSort() : undefined,
      limit: this.searchType() === 'all' ? 5 : this.appliedLimit() !== 20 ? this.appliedLimit() : undefined,
    };
  });

  readonly listingsResource = this.#searchService.getListingsResource(this.listingParams);
  readonly businessesResource = this.#searchService.getBusinessesResource(this.businessParams);
  readonly usersResource = this.#searchService.getUsersResource(this.userParams);
  readonly toursResource = this.#searchService.getToursResource(this.tourParams);

  readonly locationsParams = computed<string | null>(() => {
    if (this.searchType() !== 'location' && this.searchType() !== 'all') return null;
    const q = this.searchQuery().trim();
    return (!q || q.length < 2) ? null : q;
  });

  readonly locationsResource = httpResource<Location[]>(() => {
    const q = this.locationsParams();
    if (!q) return undefined;
    const url = `${environment.apiUrl}/v1/locations/search?q=${encodeURIComponent(q)}`;
    return this.searchType() === 'all' ? `${url}&limit=5` : url;
  });

  readonly popularBusinessesResource = this.#searchService.getBusinessesResource(
    computed(() => ({ limit: 10 })),
  );

  readonly seoConfig = computed(() => {
    const q = this.searchQuery();
    return {
      title: q ? `Search results for "${q}"` : 'Search',
      description: 'Find local businesses, services, and products near you.',
    };
  });

  // Computed items with optimistic overrides baked in
  readonly listingItems = computed(() =>
    (this.listingsResource.value()?.items || []).map((item: any) => ({
      ...item,
      isSaved: this.saveOverrides()[item.id] ?? !!item.isSaved,
    }))
  );

  readonly businessItems = computed(() =>
    (this.businessesResource.value()?.items || []).map((item: any) => ({
      ...item,
      isFollowed: this.followOverrides()[item.id] ?? !!item.isFollowed,
    }))
  );

  readonly userItems = computed(() =>
    (this.usersResource.value()?.items || []).map((item: any) => ({
      ...item,
      isFollowed: this.followOverrides()[item.id] ?? !!item.isFollowed,
    }))
  );

  readonly locationItems = computed(() =>
    (this.locationsResource.value() || []).map((item: any) => ({
      ...item,
      isFollowed: this.followOverrides()[item.id || item.externalId] ?? !!item.isFollowed,
    }))
  );

  readonly popularBusinessItems = computed(() =>
    (this.popularBusinessesResource.value()?.items || []).map((item: any) => ({
      ...item,
      isFollowed: this.followOverrides()[item.id] ?? !!item.isFollowed,
    }))
  );

  constructor() {
    toObservable(this.rawQuery)
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((q) => {
        this.updateUrl({ q: q || null });
        if (q && q.trim().length > 0) {
          this.saveToLocalList('orita_recent_searches', q.trim(), this.recentSearches);
        }
      });
  }

  onFollowToggle(type: FollowType, id: string | undefined, wantToFollow: boolean) {
    if (!id) return;
    this.followOverrides.update((map) => ({ ...map, [id]: wantToFollow }));
    const action$ = wantToFollow
      ? this.#followService.follow(type, id)
      : this.#followService.unfollow(type, id);
    action$.subscribe({ error: () => this.followOverrides.update((map) => ({ ...map, [id!]: !wantToFollow })) });
  }

  onSaveToggle(listingId: string, wantToSave: boolean) {
    this.saveOverrides.update((map) => ({ ...map, [listingId]: wantToSave }));
    this.#saveService.toggleSaveListing(listingId, !wantToSave).subscribe({
      error: () => this.saveOverrides.update((map) => ({ ...map, [listingId]: !wantToSave })),
    });
  }

  onSearchInputString(val: string) { this.rawQuery.set(val); }
  clearSearch() { this.rawQuery.set(''); this.updateUrl({ limit: null }); }
  setSearchType(type: 'all' | 'people' | 'listing' | 'business' | 'location' | 'tour') { this.updateUrl({ tab: type, limit: null }); }
  setCategory(categoryId: string | null) { this.updateUrl({ categoryId, limit: null }); }
  clearCategory() { this.updateUrl({ categoryId: null, limit: null }); }
  loadMore() { this.updateUrl({ limit: this.appliedLimit() + 20 }); }
  applyRecentSearch(query: string) { this.rawQuery.set(query); }
  openFilters() { this.isFiltersOpen.set(true); }

  onApplyFilters(filters: SearchFilterState) {
    this.updateUrl({
      lat: filters.lat || null, lng: filters.lng || null,
      locationName: filters.locationName || null,
      radius: filters.radius !== 10 ? filters.radius : null,
      categoryId: filters.categoryId || null,
      sort: filters.sort !== 'relevance' ? filters.sort : null,
      minPrice: filters.minPrice || null, maxPrice: filters.maxPrice || null,
      filter: filters.filters || null, limit: null,
    });
  }

  private updateUrl(params: any) {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private loadLocalStorage(key: string): any[] {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  }

  private saveToLocalList(key: string, item: any, signalRef: any, comparator = (a: any, b: any) => a === b) {
    try {
      const current = this.loadLocalStorage(key);
      const filtered = current.filter((e) => !comparator(e, item));
      const updated = [item, ...filtered].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(updated));
      signalRef.set(updated);
    } catch {}
  }
}
