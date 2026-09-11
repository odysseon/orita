import { Component, input, output, signal, computed, effect, inject, resource } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Drawer } from 'ur-ui';

import { AppFormField } from 'ur-ui';
import { CategoryService } from '../../../../core/services/category.service';
import { LocationPicker } from '../../../../shared/ui/organisms/location-picker/location-picker';
import { Location } from '../../../../core/services/location.service';
import { Button } from 'ur-ui';
import { SelectDirective } from 'ur-ui';
import { InputDirective } from 'ur-ui';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from 'ur-ui';

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
  imports: [FormField, 
    Drawer,
    AppFormField,
    LocationPicker, Button, SelectDirective, InputDirective, Combobox, ComboboxInput, ComboboxList, ComboboxOption
  ],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.css',
  standalone: true
})
export class SearchFiltersComponent {
  readonly isOpen = input<boolean>(false);
  readonly isOpenChange = output<boolean>();
  
  readonly searchType = input<'all' | 'people' | 'listing' | 'business' | 'location' | 'tour'>('listing');
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
  readonly currentLat = signal<number | null>(null);
  readonly currentLng = signal<number | null>(null);

  readonly categoryQuery = signal<string>('');
  readonly categoryInputFocused = signal<boolean>(false);
  readonly filteredCategories = computed(() => {
    const q = this.categoryQuery().toLowerCase().trim();
    const all = this.categories() || [];
    if (!q) return all;
    return all.filter(c => c.name?.toLowerCase().includes(q));
  });

  readonly internalModel = signal({
    locationName: '',
    radius: 10,
    categoryId: '',
    sort: 'relevance',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    filters: {} as Record<string, any>
  });


  readonly filtersForm = form(this.internalModel, () => {});

  readonly categoryAttributesResource = resource({
    params: () => ({ categoryId: this.internalModel()?.categoryId || '' }),
    loader: async ({ params }) => {
      const categoryId = params.categoryId;
      if (!categoryId) return [];
      return this.#categoryService.getCategoryAttributes(categoryId);
    }
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const current = this.currentFilters();
        
        const filtersRecord: Record<string, any> = {};
        
        for (const f of current.filters || []) {
          const parts = f.split(':');
          if (parts.length >= 2) {
            filtersRecord[parts[0]] = parts.slice(1).join(':');
          }
        }

        this.internalModel.set({
          locationName: current.locationName || '',
          radius: current.radius || 10,
          categoryId: current.categoryId || '',
          sort: current.sort || 'relevance',
          minPrice: current.minPrice || null,
          maxPrice: current.maxPrice || null,
          filters: filtersRecord
        });

        this.currentLat.set(current.lat || null);
        this.currentLng.set(current.lng || null);
      }
    });
  }

  onLocationPicked(loc: Location) {
    this.internalModel.update(m => ({
      ...m,
      locationName: loc.name || loc.formattedAddress || ''
    }));
    this.currentLat.set(loc.latitude);
    this.currentLng.set(loc.longitude);
  }

  updateRadius(val: string) {
    this.internalModel.update(m => ({ ...m, radius: Number(val) }));
  }

  onCategorySelected(val: any) {
    const id = val?.id || '';
    this.internalModel.update(m => ({ ...m, categoryId: id, filters: {} }));
    this.categoryQuery.set('');
  }

  getCategoryName(id: string | null | undefined): string {
    if (!id) return '';
    const cat = (this.categories() || []).find(c => c.id === id);
    return cat ? cat.name : '';
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

  updateFilter(key: string, value: any) {
    this.internalModel.update(m => ({
      ...m,
      filters: {
        ...m.filters,
        [key]: value
      }
    }));
  }

  private emitApply() {
    const filtersArray: string[] = [];
    const currentFilters = this.internalModel().filters || {};
    for (const key of Object.keys(currentFilters)) {
      if (currentFilters[key]) {
        filtersArray.push(`${key}:${currentFilters[key]}`);
      }
    }

    const val = this.internalModel();
    const locationName = (val.locationName || '').trim();

    this.applyFilters.emit({
      locationName: locationName || null,
      lat: this.currentLat(),
      lng: this.currentLng(),
      radius: Number(val.radius) !== 10 ? Number(val.radius) : null,
      categoryId: val.categoryId || null,
      sort: val.sort !== 'relevance' ? val.sort! : null,
      minPrice: val.minPrice || null,
      maxPrice: val.maxPrice || null,
      filters: filtersArray.length ? filtersArray : null
    });
    this.isOpenChange.emit(false);
  }
}
