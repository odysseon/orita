import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../services/toast';
import { CookieService } from '../services/cookie';
import { ILogin, ILoginResponse } from '../../pages/auth/login/login.interface';
import { IRegister } from '../../pages/auth/register/register.interface';
import { environment } from '../../../environments/environment';
import { ExplorationService } from './exploration.service';
import { IProfile } from '../../pages/profile/profile.interface';
import { effect } from '@angular/core';
import { NotificationPermissionService } from './notification-permission.service';
import { CacheService, CacheKeys } from './cache.service';
import { DatabaseService } from './database.service';

const TOKEN_KEY = 'auth_token';

@Service()
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);
  #cookie = inject(CookieService);
  #exploration = inject(ExplorationService);
  #push = inject(NotificationPermissionService);
  #cache = inject(CacheService);
  #db = inject(DatabaseService);

  readonly token = signal<string | undefined>(this.#cookie.get(TOKEN_KEY));
  readonly currentUser = signal<IProfile | null>(this.#cache.get<IProfile>(CacheKeys.PROFILE));

  constructor() {
    effect(() => {
      const t = this.token();
      if (t) {
        this.fetchCurrentUser();
      } else {
        this.currentUser.set(null);
      }
    });
  }

  async fetchCurrentUser(): Promise<void> {
    try {
      const profile = await firstValueFrom(
        this.#http.get<IProfile>(`${environment.apiUrl}/users/me`)
      );
      this.#cache.set(CacheKeys.PROFILE, profile);
      this.currentUser.set(profile);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  }

  async login(credentials: ILogin & { remember: boolean }, returnUrl: string = '/home'): Promise<boolean> {
    try {
      const { remember, ...payload } = credentials;
      const res = await firstValueFrom(
        this.#http.post<ILoginResponse>(`${environment.apiUrl}/auth/login`, payload),
      );
      this.#setToken(res.token, remember ? new Date(res.expiresAt) : undefined);
      this.#toast.success('Logged in', 'Welcome back!');
      await this.#router.navigateByUrl(returnUrl);
      return true;
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Login failed. Please try again.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
      return false;
    }
  }

  async loginWithGoogle(idToken: string, returnUrl: string = '/home'): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.#http.post<ILoginResponse>(`${environment.apiUrl}/auth/google`, { idToken }),
      );
      
      if (res.token) {
        this.#setToken(res.token, res.expiresAt ? new Date(res.expiresAt) : undefined);
      }

      if (returnUrl === '/home' && !this.#exploration.hasLocation()) {
        returnUrl = '/welcome';
      }
      this.#toast.success('Logged in', 'Welcome to Orita!');
      await this.#router.navigateByUrl(returnUrl);
      return true;
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Google Sign-In failed. Please try again.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
      return false;
    }
  }

  async register(credentials: IRegister): Promise<void> {
    try {
      await firstValueFrom(this.#http.post(`${environment.apiUrl}/accounts/register`, credentials));
      // Seamlessly authenticate after registration
      const loginSuccess = await this.login({
        email: credentials.email,
        password: credentials.password,
        remember: false,
      }, '/welcome');
      if (loginSuccess) {
        this.#toast.success('Account created', 'Welcome to Orita!');
      }
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Registration failed. Please try again.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
    }
  }

  logout(expired = false, returnUrl?: string, shouldRedirect = true): void {
    // Unsubscribe from push notifications before removing the token
    this.#push.unsubscribe().catch((err) => console.error(err));

    this.#cookie.delete(TOKEN_KEY, { secure: environment.production });
    this.#cache.remove(CacheKeys.PROFILE);
    this.token.set(undefined);
    this.currentUser.set(null);
    this.#db.clearConversationsAndMessages().catch(err => console.error(err));
    
    if (expired && shouldRedirect) {
      this.#toast.error('Session Expired', 'Please log in again to continue.');
    } else if (!expired && shouldRedirect) {
      this.#toast.info('Goodbye', 'You have been logged out.');
    }
    
    if (shouldRedirect) {
      this.#router.navigate(['/auth/login'], returnUrl ? { queryParams: { returnUrl } } : undefined);
    }
  }

  #refreshPromise: Promise<string | null> | null = null;

  async refreshToken(): Promise<string | null> {
    if (this.#refreshPromise) return this.#refreshPromise;

    this.#refreshPromise = (async () => {
      try {
        const res = await firstValueFrom(
          this.#http.post<{ token: string; expiresAt: string }>(`${environment.apiUrl}/auth/refresh`, {})
        );
        if (res.token) {
          this.#setToken(res.token, res.expiresAt ? new Date(res.expiresAt) : undefined);
          return res.token;
        }
        return null;
      } catch (err) {
        return null;
      } finally {
        this.#refreshPromise = null;
      }
    })();

    return this.#refreshPromise;
  }

  #setToken(token: string, expires?: Date): void {
    this.#cookie.set(TOKEN_KEY, token, {
      expires,
      secure: environment.production,
    });
    this.token.set(token);
  }
}
