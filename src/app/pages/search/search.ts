import { Component, signal, computed, inject, effect, resource } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideSearch, LucideX, LucideClock, LucideSlidersHorizontal, LucideMapPin, LucideNavigation } from '@lucide/angular';
import { SearchService } from '../../core/services/search.service';
import { CategoryService } from '../../core/services/category.service';
import { GeocodingService, GeocodeResult } from '../../core/services/geocoding.service';
import { SearchFilters } from '../../core/models/search.model';
import { AppListingCard } from '../../shared/listing-card/listing-card';
import { AppBizCard } from '../../shared/biz-card/biz-card';
import { Drawer } from '../../shared/drawer/drawer';
import { AppHeader } from '../../shared/app-header/app-header';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { FormsModule } from '@angular/forms';
import { AppFormField } from '../../shared/form-field/form-field';

@Component({
  selector: 'app-search',
  imports: [
    LucideSearch, LucideX, LucideClock, LucideSlidersHorizontal, LucideMapPin, LucideNavigation,
    AppListingCard, AppBizCard, Drawer, AppHeader, ScrollHideDirective, FormsModule, AppFormField
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  #searchService = inject(SearchService);
  #categoryService = inject(CategoryService);
  #geocodingService = inject(GeocodingService);
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
  readonly appliedLat = computed(() => Number(this.queryParamMap()?.get('lat')) || undefined);
  readonly appliedLng = computed(() => Number(this.queryParamMap()?.get('lng')) || undefined);
  readonly appliedRadius = computed(() => Number(this.queryParamMap()?.get('radius')) || 10);
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
  readonly isGeocoding = signal(false);
  
  // Temporary Filter State (before applying)
  readonly tempLocationName = signal('');
  readonly tempRadius = signal(10);
  readonly tempCategoryId = signal('');
  readonly tempSort = signal('relevance');
  readonly tempMinPrice = signal<number | null>(null);
  readonly tempMaxPrice = signal<number | null>(null);
  readonly tempFilters = signal<Record<string, string>>({});
  readonly recentLocations = signal<GeocodeResult[]>(this.loadLocalStorage('orita_recent_locations'));

  readonly categoryAttributesResource = resource({
    params: () => ({ categoryId: this.tempCategoryId() }),
    loader: async ({ params }) => {
      if (!params.categoryId) return [];
      return this.#categoryService.getCategoryAttributes(params.categoryId);
    }
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

  // Drawer Actions
  openFilters() {
    this.tempLocationName.set(this.appliedLocationName());
    this.tempRadius.set(this.appliedRadius());
    this.tempCategoryId.set(this.appliedCategoryId() || '');
    this.tempSort.set(this.appliedSort());
    this.tempMinPrice.set(this.appliedMinPrice() || null);
    this.tempMaxPrice.set(this.appliedMaxPrice() || null);
    this.tempFilters.set({ ...this.appliedFilters() });
    this.isFiltersOpen.set(true);
  }

  useCurrentLocation() {
    if (!navigator.geolocation) return;
    
    this.isGeocoding.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.#geocodingService.reverseGeocode(lat, lng).subscribe({
          next: (res) => {
            if (res) {
              this.applyLocationResult(res);
            }
            this.isGeocoding.set(false);
          },
          error: () => {
            this.isGeocoding.set(false);
            this.applyLocationResult({ displayName: 'Current Location', lat, lng });
          }
        });
      },
      () => {
        this.isGeocoding.set(false);
      }
    );
  }

  applyRecentLocation(loc: GeocodeResult) {
    this.tempLocationName.set(loc.displayName);
    this.applyLocationResult(loc);
  }

  applyFilters() {
    const filtersArray: string[] = [];
    const currentFilters = this.tempFilters();
    for (const key of Object.keys(currentFilters)) {
      if (currentFilters[key]) {
        filtersArray.push(`${key}:${currentFilters[key]}`);
      }
    }

    const locName = this.tempLocationName().trim();
    
    if (locName && locName !== this.appliedLocationName()) {
      this.isGeocoding.set(true);
      this.#geocodingService.geocode(locName).subscribe({
        next: (res) => {
          this.isGeocoding.set(false);
          if (res) {
            this.applyLocationResult(res, filtersArray);
          } else {
            this.pushFiltersToUrl(undefined, undefined, undefined, filtersArray);
            this.isFiltersOpen.set(false);
          }
        },
        error: () => {
          this.isGeocoding.set(false);
          this.isFiltersOpen.set(false);
        }
      });
    } else {
      this.pushFiltersToUrl(this.appliedLat(), this.appliedLng(), locName || undefined, filtersArray);
      this.isFiltersOpen.set(false);
    }
  }

  clearFilters() {
    this.tempLocationName.set('');
    this.tempRadius.set(10);
    this.tempCategoryId.set('');
    this.tempSort.set('relevance');
    this.tempMinPrice.set(null);
    this.tempMaxPrice.set(null);
    this.tempFilters.set({});
    this.updateUrl({
      lat: null,
      lng: null,
      locationName: null,
      radius: null,
      categoryId: null,
      sort: null,
      limit: null,
      minPrice: null,
      maxPrice: null,
      filter: null
    });
    this.isFiltersOpen.set(false);
  }

  private applyLocationResult(res: GeocodeResult, filters?: string[]) {
    this.saveToLocalList('orita_recent_locations', res, this.recentLocations, (a, b) => a.displayName === b.displayName);
    this.pushFiltersToUrl(res.lat, res.lng, res.displayName, filters);
    this.isFiltersOpen.set(false);
  }

  private pushFiltersToUrl(lat?: number, lng?: number, locationName?: string, filters?: string[]) {
    this.updateUrl({
      lat: lat || null,
      lng: lng || null,
      locationName: locationName || null,
      radius: this.tempRadius() !== 10 ? this.tempRadius() : null,
      categoryId: this.tempCategoryId() || null,
      sort: this.tempSort() !== 'relevance' ? this.tempSort() : null,
      minPrice: this.tempMinPrice(),
      maxPrice: this.tempMaxPrice(),
      filter: filters || null,
      limit: null
    });
  }

  onFilterChange(key: string, value: any) {
    this.tempFilters.update(filters => ({
      ...filters,
      [key]: value
    }));
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
