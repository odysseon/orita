import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type DiscoveryItemType = 'BUSINESS' | 'LISTING' | 'TOUR' | 'PROMOTION';

export interface FeedItemView {
  id: string;
  itemType: DiscoveryItemType;
  referenceId: string;
  businessProfileId: string;
  score: number;
  distanceMeters: number;
  createdAt: string;
  business?: any;
  listing?: any;
  tour?: any;
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
