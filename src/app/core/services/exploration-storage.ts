import { Injectable, inject } from '@angular/core';
import { CookieService } from './cookie';

export interface ActiveLocation {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  lat: number;
  lng: number;
}

export abstract class ExplorationStorage {
  abstract get(): ActiveLocation | null;
  abstract set(context: ActiveLocation): void;
  abstract clear(): void;
}

@Injectable({
  providedIn: 'root'
})
export class CookieExplorationStorage extends ExplorationStorage {
  private readonly COOKIE_KEY = 'orita.exploration';
  #cookieService = inject(CookieService);

  get(): ActiveLocation | null {
    const raw = this.#cookieService.get(this.COOKIE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ActiveLocation;
    } catch (e) {
      return null;
    }
  }

  set(context: ActiveLocation): void {
    // 1 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    this.#cookieService.set(this.COOKIE_KEY, JSON.stringify(context), {
      expires,
      path: '/',
      sameSite: 'Lax',
      // secure: true // TODO: enable in prod when HTTPS is guaranteed everywhere
    });
  }

  clear(): void {
    this.#cookieService.delete(this.COOKIE_KEY, { path: '/', sameSite: 'Lax' });
  }
}
