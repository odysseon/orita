import { Service, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { IListingSummary, IBusinessSummary, IPaginated } from '../../pages/home/home.interface';
import { IProfile } from '../../pages/profile/profile.interface';
import { SearchFilters } from '../models/search.model';

@Service()
export class SearchService {
  #apiUrl = `${environment.apiUrl}/search`;

  private buildUrl(base: string, params: SearchFilters | null): string | undefined {
    if (!params) return undefined;

    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            urlParams.append(key, v);
          });
        } else {
          urlParams.append(key, String(value));
        }
      }
    });

    const qs = urlParams.toString();
    return `${base}${qs ? `?${qs}` : ''}`;
  }

  getListingsResource(paramsSignal: Signal<SearchFilters | null>) {
    return httpResource<IPaginated<IListingSummary>>(() => 
      this.buildUrl(`${this.#apiUrl}/listings`, paramsSignal())
    );
  }

  getBusinessesResource(paramsSignal: Signal<SearchFilters | null>) {
    return httpResource<IPaginated<IBusinessSummary>>(() => 
      this.buildUrl(`${this.#apiUrl}/businesses`, paramsSignal())
    );
  }

  getUsersResource(paramsSignal: Signal<SearchFilters | null>) {
    return httpResource<IPaginated<IProfile>>(() => 
      this.buildUrl(`${this.#apiUrl}/users`, paramsSignal())
    );
  }

  getToursResource(paramsSignal: Signal<SearchFilters | null>) {
    return httpResource<IPaginated<any>>(() => 
      this.buildUrl(`${this.#apiUrl}/tours`, paramsSignal())
    );
  }
}
