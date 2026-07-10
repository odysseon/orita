import { Component, signal, computed, inject, effect, resource } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideSearch, LucideX, LucideClock, LucideSlidersHorizontal, LucideMapPin, LucideNavigation } from '@lucide/angular';
import { SearchService } from '../../core/services/search.service';
import { ExplorationService } from '../../core/services/exploration.service';
import { CategoryService } from '../../core/services/category.service';
import { LocationService, Location } from '../../core/services/location.service';
import { SearchFilters } from '../../core/models/search.model';
import { AppListingCard } from '../../shared/listing-card/listing-card';
import { AppBizCard } from '../../shared/biz-card/biz-card';
import { AppHeader } from '../../shared/app-header/app-header';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { AppGrid } from '../../shared/grid/grid';
import { SearchFiltersComponent, SearchFilterState } from './components/search-filters/search-filters';
import { RecentSearches } from './components/recent-searches/recent-searches';
import { TrendingCategories } from './components/trending-categories/trending-categories';
import { SeoComponent } from '../../shared/seo/seo.component';

@Component({
  selector: 'app-search',
  imports: [
    LucideSearch, LucideX, LucideSlidersHorizontal, LucideMapPin,
    AppListingCard, AppBizCard, AppHeader, ScrollHideDirective,
    AppGrid, SearchFiltersComponent, RecentSearches, TrendingCategories, SeoComponent
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  #searchService = inject(SearchService);
  #exploration = inject(ExplorationService);
  #categoryService = inject(CategoryService);
  #locationService = inject(LocationService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  // Global Categories
  readonly categories = this.#categoryService.leafCategories;

  // URL State
  readonly queryParamMap = toSignal(this.#route.queryParamMap);

  readonly searchType = computed<'listing' | 'business'>(() => {
    return (this.queryParamMap()?.get('tab') as any) || 'listing';
  });

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
  readonly appliedFilters = computed(() => {
    const filters = this.queryParamMap()?.getAll('filter') || [];
    const obj: Record<string, string> = {};
    for (const f of filters) {
      const parts = f.split(':');
      if (parts.length >= 2) {
        obj[parts[0]] = parts.slice(1).join(':');
      }
    }
    return obj;
  });

  // Local Search Input
  readonly rawQuery = signal(this.#route.snapshot.queryParamMap.get('q') || '');
  readonly isDebouncing = computed(() => this.rawQuery() !== this.searchQuery());
  readonly recentSearches = signal<string[]>(this.loadLocalStorage('orita_recent_searches'));

  // Drawer & Filter State
  readonly isFiltersOpen = signal(false);
  
  readonly currentFiltersState = computed<SearchFilterState>(() => {
    return {
      locationName: this.appliedLocationName() || null,
      lat: this.appliedLat() || null,
      lng: this.appliedLng() || null,
      radius: this.appliedRadius() || 15000,
      categoryId: this.appliedCategoryId() || null,
      sort: this.appliedSort() || 'relevance',
      minPrice: this.appliedMinPrice() || null,
      maxPrice: this.appliedMaxPrice() || null,
      filters: this.queryParamMap()?.getAll('filter') || null
    };
  });

  // Derived API Parameters
  readonly listingParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'listing') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName() && !this.appliedCategoryId()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(),
      lng: this.appliedLng(),
      radius: this.appliedRadius(),
      categoryId: this.appliedCategoryId(),
      sort: this.appliedSort() !== 'relevance' ? this.appliedSort() : undefined,
      limit: this.appliedLimit() !== 20 ? this.appliedLimit() : undefined,
      minPrice: this.appliedMinPrice(),
      maxPrice: this.appliedMaxPrice(),
      filter: this.queryParamMap()?.getAll('filter') || []
    };
  });

  readonly businessParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'business') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName() && !this.appliedCategoryId()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(),
      lng: this.appliedLng(),
      radius: this.appliedRadius(),
      categoryId: this.appliedCategoryId(),
      sort: this.appliedSort() !== 'relevance' ? this.appliedSort() : undefined,
      limit: this.appliedLimit() !== 20 ? this.appliedLimit() : undefined
    };
  });

  readonly listingsResource = this.#searchService.getListingsResource(this.listingParams);
  readonly businessesResource = this.#searchService.getBusinessesResource(this.businessParams);
  
  // Empty State Data
  readonly popularBusinessesResource = this.#searchService.getBusinessesResource(computed(() => ({ limit: 10 })));

  readonly seoConfig = computed(() => {
    const q = this.searchQuery();
    return {
      title: q ? `Search results for "${q}"` : 'Search',
      description: 'Find local businesses, services, and products near you.',
    };
  });

  constructor() {
    toObservable(this.rawQuery).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(q => {
      this.updateUrl({ q: q || null });
      if (q && q.trim().length > 0) {
        this.saveToLocalList('orita_recent_searches', q.trim(), this.recentSearches);
      }
    });
  }

  // Search Input Actions
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.rawQuery.set(input.value);
  }

  clearSearch() {
    this.rawQuery.set('');
    this.updateUrl({ limit: null });
  }

  setSearchType(type: 'listing' | 'business') {
    this.updateUrl({ tab: type, limit: null });
  }

  setCategory(categoryId: string | null) {
    this.updateUrl({ categoryId, limit: null });
  }

  clearCategory() {
    this.updateUrl({ categoryId: null, limit: null });
  }

  loadMore() {
    this.updateUrl({ limit: this.appliedLimit() + 20 });
  }

  applyRecentSearch(query: string) {
    this.rawQuery.set(query);
  }

  openFilters() {
    this.isFiltersOpen.set(true);
  }

  onApplyFilters(filters: SearchFilterState) {
    this.updateUrl({
      lat: filters.lat || null,
      lng: filters.lng || null,
      locationName: filters.locationName || null,
      radius: filters.radius !== 10 ? filters.radius : null,
      categoryId: filters.categoryId || null,
      sort: filters.sort !== 'relevance' ? filters.sort : null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
      filter: filters.filters || null,
      limit: null
    });
  }

  private updateUrl(params: any) {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  // Local Storage Helpers
  private loadLocalStorage(key: string): any[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalList(key: string, item: any, signalRef: any, comparator: (a: any, b: any) => boolean = (a, b) => a === b) {
    try {
      const current = this.loadLocalStorage(key);
      const filtered = current.filter(existing => !comparator(existing, item));
      const updated = [item, ...filtered].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(updated));
      signalRef.set(updated);
    } catch {}
  }
}
