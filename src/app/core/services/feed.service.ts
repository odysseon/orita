import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type DiscoveryItemType = 'BUSINESS' | 'LISTING' | 'TOUR' | 'PROMOTION';

export interface FeedMedia {
  id: string;
  url: string;
  type: string;
  role: string;
}

export interface FeedBusiness {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
}

export interface FeedListing {
  id: string;
  title: string;
  slug: string;
  description?: string;
  minPrice?: number | string;
  currencyCode?: string;
  media?: FeedMedia[];
}

export interface FeedTour {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  media?: FeedMedia[];
}

export interface FeedItemView {
  id: string;
  itemType: DiscoveryItemType;
  referenceId: string;
  businessProfileId: string;
  score: number;
  distanceMeters: number;
  createdAt: string;
  business?: FeedBusiness;
  listing?: FeedListing;
  tour?: FeedTour;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  #http = inject(HttpClient);

  getFeed(params: { limit?: number; cursorScore?: number; cursorId?: string }): Observable<FeedItemView[]> {
    let httpParams = new HttpParams();
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit);
    }
    if (params.cursorScore !== undefined && params.cursorId) {
      httpParams = httpParams.set('cursorScore', params.cursorScore);
      httpParams = httpParams.set('cursorId', params.cursorId);
    }

    return this.#http.get<FeedItemView[]>(`${environment.apiUrl}/feed`, { params: httpParams });
  }
}
