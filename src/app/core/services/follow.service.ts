import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  getStatus(type: FollowType, targetId: string): Observable<FollowStatus> {
    return this.#http.get<FollowStatus>(`${this.#apiUrl}/follows/${type}/${targetId}/status`);
  }
}
