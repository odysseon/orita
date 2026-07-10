import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExplorationStorage, ActiveLocation } from './exploration-storage';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {
  #storage = inject(ExplorationStorage);
  #locationService = inject(LocationService);

  readonly activeLocation = signal<ActiveLocation | null>(this.#storage.get());
  readonly hasLocation = computed(() => !!this.activeLocation());

  setLocation(context: ActiveLocation): void {
    this.#storage.set(context);
    this.activeLocation.set(context);
  }

  clearLocation(): void {
    this.#storage.clear();
    this.activeLocation.set(null);
  }

  async setFromGps(): Promise<ActiveLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await firstValueFrom(this.#locationService.reverseGeocode(latitude, longitude));
            
            const newContext: ActiveLocation = {
              id: res?.id || `gps_${latitude}_${longitude}`,
              name: res?.name || 'Current Location',
              city: res?.formattedAddress || null, // simplified since we just have formattedAddress
              state: null,
              country: null,
              lat: latitude,
              lng: longitude,
            };
            
            this.setLocation(newContext);
            resolve(newContext);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
