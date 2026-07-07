import { Service, inject, signal, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from './cookie';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme';

@Service()
export class ThemeService {
  #cookie = inject(CookieService);
  #platformId = inject(PLATFORM_ID);

  readonly preference = signal<ThemePreference>(
    (this.#cookie.get(THEME_KEY) as ThemePreference) ?? 'system',
  );

  #mediaQuery = isPlatformBrowser(this.#platformId) ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  constructor() {
    if (this.#mediaQuery) {
      this.#mediaQuery.addEventListener('change', () => {
        if (this.preference() === 'system') {
          this.#apply('system');
        }
      });
    }
    effect(() => {
      this.#apply(this.preference());
    });
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    this.#cookie.set(THEME_KEY, preference, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'Strict',
      secure: false,
    });
  }

  #apply(preference: ThemePreference): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const html = document.documentElement;
    
    let resolvedTheme = preference;
    if (preference === 'system') {
      resolvedTheme = this.#mediaQuery?.matches ? 'dark' : 'light';
    }
    
    html.setAttribute('data-theme', resolvedTheme);
  }
}
