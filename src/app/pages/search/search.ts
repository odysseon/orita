import { Component, signal, computed, inject } from '@angular/core';
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [
    LucideSearch, LucideX, LucideClock, LucideSlidersHorizontal, LucideMapPin, LucideNavigation,
    AppListingCard, AppBizCard, Drawer, FormsModule
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
  readonly recentLocations = signal<GeocodeResult[]>(this.loadLocalStorage('orita_recent_locations'));

  // Derived API Parameters
  readonly listingParams = computed<SearchFilters | null>(() => {
    if (this.searchType() !== 'listing') return null;
    if (!this.searchQuery().trim() && !this.appliedLocationName() && !this.appliedCategoryId()) return null;
    return {
      q: this.searchQuery().trim(),
      lat: this.appliedLat(),
      lng: this.appliedLng(),
      radius: this.appliedRadius(),
      categoryId: this.appliedCategoryId()
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
      categoryId: this.appliedCategoryId()
    };
  });

  readonly listingsResource = this.#searchService.getListingsResource(this.listingParams);
  readonly businessesResource = this.#searchService.getBusinessesResource(this.businessParams);

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
  }

  setSearchType(type: 'listing' | 'business') {
    this.updateUrl({ tab: type });
  }

  applyRecentSearch(query: string) {
    this.rawQuery.set(query);
  }

  // Drawer Actions
  openFilters() {
    this.tempLocationName.set(this.appliedLocationName());
    this.tempRadius.set(this.appliedRadius());
    this.tempCategoryId.set(this.appliedCategoryId() || '');
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
            // Fallback if reverse geocode fails
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
    const locName = this.tempLocationName().trim();
    
    // If location changed and doesn't match current, we need to geocode
    if (locName && locName !== this.appliedLocationName()) {
      this.isGeocoding.set(true);
      this.#geocodingService.geocode(locName).subscribe({
        next: (res) => {
          this.isGeocoding.set(false);
          if (res) {
            this.applyLocationResult(res);
          } else {
            // No result found, just apply other filters
            this.pushFiltersToUrl(undefined, undefined, undefined);
            this.isFiltersOpen.set(false);
          }
        },
        error: () => {
          this.isGeocoding.set(false);
          this.isFiltersOpen.set(false);
        }
      });
    } else {
      // Location hasn't changed, just apply radius/category
      this.pushFiltersToUrl(this.appliedLat(), this.appliedLng(), locName || undefined);
      this.isFiltersOpen.set(false);
    }
  }

  clearFilters() {
    this.updateUrl({
      lat: null,
      lng: null,
      locationName: null,
      radius: null,
      categoryId: null
    });
    this.isFiltersOpen.set(false);
  }

  private applyLocationResult(res: GeocodeResult) {
    this.saveToLocalList('orita_recent_locations', res, this.recentLocations, (a, b) => a.displayName === b.displayName);
    this.pushFiltersToUrl(res.lat, res.lng, res.displayName);
    this.isFiltersOpen.set(false);
  }

  private pushFiltersToUrl(lat?: number, lng?: number, locationName?: string) {
    this.updateUrl({
      lat: lat || null,
      lng: lng || null,
      locationName: locationName || null,
      radius: this.tempRadius() !== 10 ? this.tempRadius() : null,
      categoryId: this.tempCategoryId() || null
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
