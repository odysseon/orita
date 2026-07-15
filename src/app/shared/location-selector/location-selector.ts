import { Component, output, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs';
import { LucideMapPin, LucideSearch, LucideLoaderCircle } from '@lucide/angular';
import { LocationService, Location } from '../../core/services/location.service';
import { firstValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [LucideMapPin, LucideSearch, LucideLoaderCircle],
  templateUrl: './location-selector.html',
  styleUrl: './location-selector.css',
})
export class LocationSelector {
  readonly locationSelected = output<Location>();

  #locationService = inject(LocationService);

  readonly searchQuery = signal('');
  readonly isLocating = signal(false);
  readonly isSearching = signal(false);

  readonly searchResults = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query.trim()) {
          this.isSearching.set(false);
          return [null];
        }
        this.isSearching.set(true);
        return this.#locationService.search(query).pipe(
          tap(() => this.isSearching.set(false))
        );
      })
    )
  );

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
