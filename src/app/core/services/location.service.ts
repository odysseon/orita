import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LocationSuggestion {
  lat: number;
  lng: number;
  address: string;
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    country?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  #http = inject(HttpClient);
  #baseUrl = 'https://nominatim.openstreetmap.org';

  search(query: string): Observable<LocationSuggestion[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    const params = {
      q: query,
      format: 'jsonv2',
      addressdetails: '1',
      limit: '6',
    };

    return this.#http.get<NominatimResult[]>(`${this.#baseUrl}/search`, { params }).pipe(
      map(results => results.map(r => this.#toSuggestion(r))),
      catchError(() => of([]))
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<LocationSuggestion | null> {
    const params = {
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'jsonv2',
      addressdetails: '1',
    };

    return this.#http.get<NominatimResult>(`${this.#baseUrl}/reverse`, { params }).pipe(
      map(r => this.#toSuggestion(r)),
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

  #toSuggestion(r: NominatimResult): LocationSuggestion {
    const a = r.address;
    const shortAddress = a
      ? [a.road, a.suburb, a.city || a.town, a.state, a.country].filter(Boolean).join(', ')
      : r.display_name;

    return {
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      address: shortAddress,
      displayName: r.display_name,
    };
  }
}
