import { Component, input, output, signal, effect, inject, resource } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Drawer } from '../../../../shared/drawer/drawer';
import { AppFormField } from '../../../../shared/form-field/form-field';
import { CategoryService } from '../../../../core/services/category.service';
import { LocationPicker } from '../../../../shared/location-picker/location-picker';
import { LocationSuggestion } from '../../../../core/services/location.service';

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
    LocationPicker
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
  #fb = inject(FormBuilder);

  readonly currentLat = signal<number | null>(null);
  readonly currentLng = signal<number | null>(null);

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

        this.currentLat.set(current.lat || null);
        this.currentLng.set(current.lng || null);
      }
    });
  }

  onLocationPicked(loc: LocationSuggestion) {
    this.filtersForm.patchValue({
      locationName: loc.displayName || loc.address
    });
    this.currentLat.set(loc.lat);
    this.currentLng.set(loc.lng);
  }

  onApply() {
    this.emitApply();
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

  private emitApply() {
    const filtersArray: string[] = [];
    const currentFilters = this.filtersForm.value.filters || {};
    for (const key of Object.keys(currentFilters)) {
      if (currentFilters[key]) {
        filtersArray.push(`${key}:${currentFilters[key]}`);
      }
    }

    const val = this.filtersForm.value;
    const locationName = (val.locationName || '').trim();

    this.applyFilters.emit({
      locationName: locationName || null,
      lat: this.currentLat(),
      lng: this.currentLng(),
      radius: val.radius !== 10 ? val.radius! : null,
      categoryId: val.categoryId || null,
      sort: val.sort !== 'relevance' ? val.sort! : null,
      minPrice: val.minPrice || null,
      maxPrice: val.maxPrice || null,
      filters: filtersArray.length ? filtersArray : null
    });
    this.isOpenChange.emit(false);
  }
}
