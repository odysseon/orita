import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../services/toast';
import { CookieService } from '../services/cookie';
import { ILogin, ILoginResponse } from '../../pages/auth/login/login.interface';
import { IRegister } from '../../pages/auth/register/register.interface';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth_token';

@Service()
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);
  #cookie = inject(CookieService);

  readonly token = signal<string | undefined>(this.#cookie.get(TOKEN_KEY));

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
      // Let's assume Google tokens have a server-defined expiry and we want to remember it automatically
      // since Google sessions are typically persistent.
      this.#setToken(res.token, new Date(res.expiresAt));
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
      });
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

  logout(expired = false, returnUrl?: string): void {
    this.#cookie.delete(TOKEN_KEY);
    this.token.set(undefined);
    if (expired) {
      this.#toast.error('Session Expired', 'Please log in again to continue.');
    } else {
      this.#toast.info('Goodbye', 'You have been logged out.');
    }
    this.#router.navigate(['/auth/login'], returnUrl ? { queryParams: { returnUrl } } : undefined);
  }

  #setToken(token: string, expires?: Date): void {
    this.#cookie.set(TOKEN_KEY, token, {
      expires,
      secure: environment.production,
    });
    this.token.set(token);
  }
}
