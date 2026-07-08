import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs';
import { LucideMapPin, LucideSearch, LucideLoaderCircle, LucideArrowRight } from '@lucide/angular';
import { ExplorationService } from '../../core/services/exploration.service';
import { GeocodingService, GeocodeResult } from '../../core/services/geocoding.service';
import { ToastService } from '../../core/services/toast';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { SeoComponent } from '../../shared/seo/seo.component';

@Component({
  selector: 'app-location',
  imports: [
    ReactiveFormsModule,
    LucideMapPin,
    LucideSearch,
    LucideLoaderCircle,
    LucideArrowRight,
    SeoComponent,
  ],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class LocationSelection {
  #exploration = inject(ExplorationService);
  #geocoding = inject(GeocodingService);
  #router = inject(Router);
  #toast = inject(ToastService);

  readonly searchControl = new FormControl('');
  readonly isLocating = signal(false);
  readonly isSearching = signal(false);

  readonly searchResults = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter((val): val is string => typeof val === 'string'),
      switchMap((query) => {
        if (!query.trim()) return [null];
        this.isSearching.set(true);
        return this.#geocoding.geocode(query);
      })
    )
  );

  constructor() {
    this.searchControl.valueChanges.subscribe((val) => {
      if (!val?.trim()) {
        this.isSearching.set(false);
      }
    });
  }

  readonly seoConfig = {
    title: 'Choose Location',
    description: 'Set your exploration context to discover local businesses and listings.'
  };

  async useCurrentLocation() {
    this.isLocating.set(true);
    try {
      await this.#exploration.setFromGps();
      this.#router.navigate(['/home']);
    } catch (error) {
      this.#toast.error('Could not get your location. Please search for a city instead.');
    } finally {
      this.isLocating.set(false);
    }
  }

  selectLocation(result: GeocodeResult) {
    const context: ActiveLocation = {
      id: `geo_${result.lat}_${result.lng}`,
      name: result.name || result.displayName,
      city: result.city || null,
      state: result.state || null,
      country: result.country || null,
      lat: result.lat,
      lng: result.lng,
    };
    
    this.#exploration.setLocation(context);
    this.#router.navigate(['/home']);
  }

  skip() {
    this.#router.navigate(['/home']);
  }
}
