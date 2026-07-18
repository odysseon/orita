import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Location {
  id: string;
  provider: string;
  externalId?: string;
  name: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
  persisted?: boolean;
  isFollowed?: boolean;
}

@Service()
export class LocationService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  search(query: string): Observable<Location[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    const params = { q: query };

    return this.#http.get<Location[]>(`${this.#apiUrl}/v1/locations/search`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<Location | null> {
    const params = {
      lat: lat.toString(),
      lon: lng.toString(),
    };

    return this.#http.get<Location>(`${this.#apiUrl}/v1/locations/reverse`, { params }).pipe(
      catchError(() => of(null))
    );
  }

  ensure(location: Location): Observable<Location> {
    const payload: any = {
      provider: location.provider,
      name: location.name,
      formattedAddress: location.formattedAddress || '',
      lat: location.latitude,
      lng: location.longitude,
    };
    if (location.externalId) {
      payload.externalId = String(location.externalId);
    }
    if (location.countryCode) {
      payload.countryCode = String(location.countryCode);
    }
    
    return this.#http.post<Location>(`${this.#apiUrl}/v1/locations/ensure`, payload);
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  }
}
