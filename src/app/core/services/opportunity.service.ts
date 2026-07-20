import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NearbyItemDto } from '../models/discovery';

export interface CreateOpportunityDto {
  type: string;
  title: string;
  body?: string;
  locationId: string;
  expiresAt?: string;
  businessProfileId?: string;
  mediaFileIds?: string[];
}

export interface UpdateOpportunityDto {
  title?: string;
  body?: string;
  expiresAt?: string;
  mediaFileIds?: string[];
}

@Service()
export class OpportunityService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  create(dto: CreateOpportunityDto): Observable<NearbyItemDto> {
    return this.#http.post<NearbyItemDto>(`${this.#apiUrl}/opportunities`, dto);
  }

  getById(id: string): Observable<NearbyItemDto> {
    return this.#http.get<NearbyItemDto>(`${this.#apiUrl}/opportunities/${id}`);
  }

  update(id: string, dto: UpdateOpportunityDto): Observable<NearbyItemDto> {
    return this.#http.patch<NearbyItemDto>(`${this.#apiUrl}/opportunities/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/opportunities/${id}`);
  }

  complete(id: string): Observable<void> {
    return this.#http.post<void>(`${this.#apiUrl}/opportunities/${id}/complete`, {});
  }

  getMyPosts(): Observable<NearbyItemDto[]> {
    return this.#http.get<NearbyItemDto[]>(`${this.#apiUrl}/opportunities/mine`);
  }
}
