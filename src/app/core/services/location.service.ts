import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Location {
  id: string;
  name: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  search(query: string): Observable<Location[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    const params = { q: query };

    return this.#http.get<Location[]>(`${this.#apiUrl}/locations/search`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<Location | null> {
    const params = {
      lat: lat.toString(),
      lon: lng.toString(),
    };

    return this.#http.get<Location>(`${this.#apiUrl}/locations/reverse`, { params }).pipe(
      catchError(() => of(null))
    );
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
