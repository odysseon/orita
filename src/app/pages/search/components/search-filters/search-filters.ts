import { Component, input, output, signal, effect, inject, resource } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
    ReactiveFormsModule,
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
  #fb = inject(FormBuilder);

  readonly isGeocoding = signal(false);
  readonly recentLocations = signal<GeocodeResult[]>(this.loadLocalStorage('orita_recent_locations'));

  readonly filtersForm = this.#fb.nonNullable.group({
    locationName: [''],
    radius: [10],
    categoryId: [''],
    sort: ['relevance'],
    minPrice: this.#fb.control<number | null>(null),
    maxPrice: this.#fb.control<number | null>(null),
    filters: this.#fb.record<string>({})
  });

  readonly categoryAttributesResource = resource({
    params: () => ({ categoryId: this.filtersForm.value.categoryId || '' }),
    loader: async ({ params }) => {
      if (!params.categoryId) return [];
      return this.#categoryService.getCategoryAttributes(params.categoryId);
    }
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const current = this.currentFilters();
        
        this.filtersForm.setControl('filters', this.#fb.record<string>({}));
        const filtersRecord = this.filtersForm.controls.filters;
        
        for (const f of current.filters || []) {
          const parts = f.split(':');
          if (parts.length >= 2) {
            filtersRecord.addControl(parts[0], this.#fb.control(parts.slice(1).join(':')));
          }
        }

        this.filtersForm.patchValue({
          locationName: current.locationName || '',
          radius: current.radius || 10,
          categoryId: current.categoryId || '',
          sort: current.sort || 'relevance',
          minPrice: current.minPrice || null,
          maxPrice: current.maxPrice || null
        }, { emitEvent: false });
      }
    });
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
    this.filtersForm.patchValue({ locationName: loc.displayName });
    this.applyLocationResult(loc);
  }

  onApply() {
    const locName = (this.filtersForm.value.locationName || '').trim();
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
    const currentFilters = this.filtersForm.value.filters || {};
    for (const key of Object.keys(currentFilters)) {
      if (currentFilters[key]) {
        filtersArray.push(`${key}:${currentFilters[key]}`);
      }
    }

    const val = this.filtersForm.value;

    this.applyFilters.emit({
      locationName: locationName || null,
      lat: lat || null,
      lng: lng || null,
      radius: val.radius !== 10 ? val.radius! : null,
      categoryId: val.categoryId || null,
      sort: val.sort !== 'relevance' ? val.sort! : null,
      minPrice: val.minPrice || null,
      maxPrice: val.maxPrice || null,
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
