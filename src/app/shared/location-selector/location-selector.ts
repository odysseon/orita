import { Component, output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs';
import { LucideMapPin, LucideSearch, LucideLoaderCircle } from '@lucide/angular';
import { LocationService, Location } from '../../core/services/location.service';
import { firstValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [ReactiveFormsModule, LucideMapPin, LucideSearch, LucideLoaderCircle],
  templateUrl: './location-selector.html',
  styleUrl: './location-selector.css',
})
export class LocationSelector {
  readonly locationSelected = output<Location>();

  #locationService = inject(LocationService);

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
        return this.#locationService.search(query).pipe(
          tap(() => this.isSearching.set(false))
        );
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

  async useCurrentLocation() {
    this.isLocating.set(true);
    try {
      const pos = await this.#locationService.getCurrentPosition();
      const suggestion = await firstValueFrom(this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude));
      if (suggestion) {
        this.locationSelected.emit(suggestion);
      }
    } catch (error) {
      // Ignored for now
    } finally {
      this.isLocating.set(false);
    }
  }

  selectLocation(result: Location) {
    this.locationSelected.emit(result);
  }
}
