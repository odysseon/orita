import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface GeocodeResult {
  displayName: string;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lng: number;
}

@Service()
export class GeocodingService {
  #http = inject(HttpClient);
  private readonly proxyUrl = `${environment.apiUrl}/geocode`;

  geocode(address: string): Observable<GeocodeResult | null> {
    if (!address.trim()) return of(null);
    
    return this.#http.get<any[]>(`${this.proxyUrl}/search`, {
      params: { q: address }
    }).pipe(
      map(results => {
        if (!results || results.length === 0) return null;
        const result = results[0];
        const address = result.address || {};
        const displayName = result.display_name.split(',').slice(0, 2).join(',').trim();
        return {
          displayName,
          name: address.neighbourhood || address.suburb || address.city || address.town || displayName,
          city: address.city || address.town || address.village,
          state: address.state || address.region,
          country: address.country,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      })
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<GeocodeResult | null> {
    return this.#http.get<any>(`${this.proxyUrl}/reverse`, {
      params: {
        lat: lat.toString(),
        lon: lng.toString()
      }
    }).pipe(
      map(result => {
        if (!result || result.error) return null;
        // Often 'city' or 'suburb' is more useful for local search than full display_name
        const address = result.address;
        const neighborhood = address.neighbourhood || address.suburb || address.city || address.town || address.village || 'Current Location';
        const state = address.state || address.region || '';
        
        return {
          displayName: state ? `${neighborhood}, ${state}` : neighborhood,
          name: neighborhood,
          city: address.city || address.town || address.village,
          state: address.state || address.region,
          country: address.country,
          lat,
          lng
        };
      })
    );
  }
}
