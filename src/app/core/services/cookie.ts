import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CookieOptions {
  expires?: Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

@Service()
export class CookieService {
  #platformId = inject(PLATFORM_ID);

  get(name: string): string | undefined {
    if (!isPlatformBrowser(this.#platformId)) return undefined;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const { expires, path = '/', secure = false, sameSite = 'Strict' } = options;
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;
    if (secure) cookie += '; Secure';
    if (expires) cookie += `; expires=${expires.toUTCString()}`;
    document.cookie = cookie;
  }

  delete(name: string, options: Pick<CookieOptions, 'path' | 'sameSite'> = {}): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const { path = '/', sameSite = 'Strict' } = options;
    document.cookie = `${name}=; path=${path}; expires=${new Date(0).toUTCString()}; SameSite=${sameSite}`;
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }
}
