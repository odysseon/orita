import { Component, input, output, signal, effect, inject, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../../shared/drawer/drawer';
import { AppFormField } from '../../../../shared/form-field/form-field';
import { CategoryService } from '../../../../core/services/category.service';
import { GeocodingService, GeocodeResult } from '../../../../core/services/geocoding.service';
import {
  LucideMapPin,
  LucideNavigation,
  LucideClock
} from '@lucide/angular';

export interface SearchFilterState {
  locationName: string | null;
  lat: number | null;
  lng: number | null;
  radius: number | null;
  categoryId: string | null;
  sort: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  filters: string[] | null;
}

@Component({
  selector: 'app-search-filters',
  imports: [
    Drawer,
    FormsModule,
    AppFormField,
    LucideMapPin,
    LucideNavigation,
    LucideClock
  ],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.css',
  standalone: true
})
export class SearchFiltersComponent {
  readonly isOpen = input<boolean>(false);
  readonly isOpenChange = output<boolean>();
  
  readonly searchType = input<'listing' | 'business'>('listing');
  readonly categories = input<any[]>([]);
  readonly currentFilters = input<SearchFilterState>({
    locationName: null,
    lat: null,
    lng: null,
    radius: 10,
    categoryId: null,
    sort: 'relevance',
    minPrice: null,
    maxPrice: null,
    filters: []
  });

  readonly applyFilters = output<SearchFilterState>();

  #categoryService = inject(CategoryService);
  #geocodingService = inject(GeocodingService);

  readonly isGeocoding = signal(false);
  readonly recentLocations = signal<GeocodeResult[]>(this.loadLocalStorage('orita_recent_locations'));

  readonly draftLocationName = signal('');
  readonly draftRadius = signal<number>(10);
  readonly draftCategoryId = signal('');
  readonly draftSort = signal('relevance');
  readonly draftMinPrice = signal<number | null>(null);
  readonly draftMaxPrice = signal<number | null>(null);
  readonly draftFilters = signal<Record<string, string>>({});

  readonly categoryAttributesResource = resource({
    params: () => ({ categoryId: this.draftCategoryId() }),
    loader: async ({ params }) => {
      if (!params.categoryId) return [];
      return this.#categoryService.getCategoryAttributes(params.categoryId);
    }
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const current = this.currentFilters();
        this.draftLocationName.set(current.locationName || '');
        this.draftRadius.set(current.radius || 10);
        this.draftCategoryId.set(current.categoryId || '');
        this.draftSort.set(current.sort || 'relevance');
        this.draftMinPrice.set(current.minPrice || null);
        this.draftMaxPrice.set(current.maxPrice || null);
        
        const filtersObj: Record<string, string> = {};
        for (const f of current.filters || []) {
          const parts = f.split(':');
          if (parts.length >= 2) {
            filtersObj[parts[0]] = parts.slice(1).join(':');
          }
        }
        this.draftFilters.set(filtersObj);
      }
    });
  }

  onFilterChange(key: string, value: any) {
    this.draftFilters.update(filters => ({
      ...filters,
      [key]: value
    }));
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
    this.draftLocationName.set(loc.displayName);
    this.applyLocationResult(loc);
  }

  onApply() {
    const locName = this.draftLocationName().trim();
    if (locName && locName !== this.currentFilters().locationName) {
      this.isGeocoding.set(true);
      this.#geocodingService.geocode(locName).subscribe({
        next: (res) => {
          this.isGeocoding.set(false);
          if (res) {
            this.applyLocationResult(res);
          } else {
            this.emitApply();
          }
        },
        error: () => {
          this.isGeocoding.set(false);
          this.emitApply();
        }
      });
    } else {
      this.emitApply(this.currentFilters().lat, this.currentFilters().lng, locName || null);
    }
  }

  clearFilters() {
    this.applyFilters.emit({
      locationName: null,
      lat: null,
      lng: null,
      radius: null,
      categoryId: null,
      sort: null,
      minPrice: null,
      maxPrice: null,
      filters: null
    });
    this.isOpenChange.emit(false);
  }

  private applyLocationResult(res: GeocodeResult) {
    this.saveToLocalList('orita_recent_locations', res, this.recentLocations, (a, b) => a.displayName === b.displayName);
    this.emitApply(res.lat, res.lng, res.displayName);
  }

  private emitApply(lat?: number | null, lng?: number | null, locationName?: string | null) {
    const filtersArray: string[] = [];
    const currentFilters = this.draftFilters();
    for (const key of Object.keys(currentFilters)) {
      if (currentFilters[key]) {
        filtersArray.push(`${key}:${currentFilters[key]}`);
      }
    }

    this.applyFilters.emit({
      locationName: locationName || null,
      lat: lat || null,
      lng: lng || null,
      radius: this.draftRadius() !== 10 ? this.draftRadius() : null,
      categoryId: this.draftCategoryId() || null,
      sort: this.draftSort() !== 'relevance' ? this.draftSort() : null,
      minPrice: this.draftMinPrice(),
      maxPrice: this.draftMaxPrice(),
      filters: filtersArray.length ? filtersArray : null
    });
    this.isOpenChange.emit(false);
  }

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
