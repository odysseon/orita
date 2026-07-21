import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LocationService, Location } from './location.service';

export type FollowType = 'business' | 'location';

export interface FollowStatus {
  following: boolean;
}

@Service()
export class FollowService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  follow(type: FollowType, targetId: string): Observable<void> {
    return this.#http.post<void>(`${this.#apiUrl}/follows/${type}/${targetId}`, {});
  }

  unfollow(type: FollowType, targetId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/follows/${type}/${targetId}`);
  }

  toggleFollow(type: FollowType, targetId: string, currentlyFollowed: boolean): Observable<void> {
    return currentlyFollowed ? this.unfollow(type, targetId) : this.follow(type, targetId);
  }

  #locationService = inject(LocationService);

  followLocation(location: Location): Observable<void> {
    if (!location.persisted && !location.id) {
      return this.#locationService.ensure(location).pipe(
        switchMap(persistedLoc => this.follow('location', persistedLoc.id))
      );
    }
    return this.follow('location', location.id);
  }

  unfollowLocation(locationId: string): Observable<void> {
    return this.unfollow('location', locationId);
  }

  getStatus(type: FollowType, targetId: string): Observable<FollowStatus> {
    return this.#http.get<FollowStatus>(`${this.#apiUrl}/follows/${type}/${targetId}/status`);
  }

  getFollowing(params?: any): Observable<any> {
    return this.#http.get<any>(`${this.#apiUrl}/follows`, { params });
  }
}
