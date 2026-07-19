import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicBusinessPreview {
  id: string;
  name: string;
  slug: string;
  locationId: string;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  joinedAt: string;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  businessCount: number;
  businesses: PublicBusinessPreview[];
  isFollowing: boolean;
}

@Service()
export class PublicUserService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  getProfile(username: string): Observable<PublicUserProfile> {
    return this.#http.get<PublicUserProfile>(`${this.#apiUrl}/users/username/${username}`);
  }

  followUser(userId: string): Observable<{ success: boolean }> {
    return this.#http.post<{ success: boolean }>(`${this.#apiUrl}/users/${userId}/follow`, {});
  }

  unfollowUser(userId: string): Observable<{ success: boolean }> {
    return this.#http.delete<{ success: boolean }>(`${this.#apiUrl}/users/${userId}/follow`);
  }
}
