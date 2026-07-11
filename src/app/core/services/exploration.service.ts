import { Service, computed, inject, signal } from '@angular/core';
import { firstValueFrom, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExplorationStorage, ActiveLocation } from './exploration-storage';
import { LocationService } from './location.service';
import { CookieService } from './cookie';
import { environment } from '../../../environments/environment';

@Service()
export class ExplorationService {
  #storage = inject(ExplorationStorage);
  #locationService = inject(LocationService);
  #http = inject(HttpClient);
  #cookie = inject(CookieService);

  readonly activeLocation = signal<ActiveLocation | null>(this.#storage.get());
  readonly hasLocation = computed(() => !!this.activeLocation());
  readonly isLocationPickerOpen = signal<boolean>(false);

  constructor() {
    this.hydrateFromBackendIfNeeded();
  }

  private get isAuthenticated(): boolean {
    return !!this.#cookie.get('auth_token');
  }

  private async hydrateFromBackendIfNeeded() {
    if (this.isAuthenticated && !this.activeLocation()) {
      try {
        const profile = await firstValueFrom(
          this.#http.get<any>(`${environment.apiUrl}/users/me`)
        );
        if (profile?.activeExplorationLat && profile?.activeExplorationLng) {
          const context: ActiveLocation = {
            id: 'backend_sync',
            name: profile.activeExplorationName || 'Saved Location',
            city: null,
            state: null,
            country: null,
            lat: profile.activeExplorationLat,
            lng: profile.activeExplorationLng,
          };
          this.#storage.set(context);
          this.activeLocation.set(context);
        }
      } catch (err) {
        // Ignored
      }
    }
  }

  private async syncToBackend(context: ActiveLocation) {
    if (this.isAuthenticated) {
      try {
        await firstValueFrom(
          this.#http.patch(`${environment.apiUrl}/users/me/exploration-context`, {
            latitude: context.lat,
            longitude: context.lng,
            name: context.name,
          }).pipe(catchError(() => of(null)))
        );
      } catch (err) {
        // Ignored
      }
    }
  }

  setLocation(context: ActiveLocation): void {
    this.#storage.set(context);
    this.activeLocation.set(context);
    this.syncToBackend(context);
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
