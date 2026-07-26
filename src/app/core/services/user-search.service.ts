import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserSearchResult } from '../types/share.types.js';

interface SearchUsersResponse {
  items: UserSearchResult[];
  total: number;
  offset: number;
  limit: number;
}

@Service()
export class UserSearchService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  search(query: string, limit = 20, offset = 0): Observable<SearchUsersResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.#http.get<SearchUsersResponse>(`${this.#apiUrl}/search/users`, { params });
  }
}
