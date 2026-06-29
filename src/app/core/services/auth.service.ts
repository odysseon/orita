import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from '../services/cookie';
import { ILogin, ILoginResponse } from '../../pages/auth/login/login.interface';
import { IRegister } from '../../pages/auth/register/register.interface';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth_token';

@Service()
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toastr = inject(ToastrService);
  #cookie = inject(CookieService);

  readonly token = signal<string | undefined>(this.#cookie.get(TOKEN_KEY));

  async login(credentials: ILogin & { remember: boolean }): Promise<boolean> {
    try {
      const { remember, ...payload } = credentials;
      const res = await firstValueFrom(
        this.#http.post<ILoginResponse>(`${environment.apiUrl}/auth/login`, payload),
      );
      this.#setToken(res.token, remember ? new Date(res.expiresAt) : undefined);
      this.#toastr.success('Welcome back!', 'Logged in');
      await this.#router.navigate(['/profile']);
      return true;
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Login failed. Please try again.')
          : 'An unexpected error occurred.';
      this.#toastr.error(message, 'Error');
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
        this.#toastr.success('Welcome to Orita!', 'Account created');
      }
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Registration failed. Please try again.')
          : 'An unexpected error occurred.';
      this.#toastr.error(message, 'Error');
    }
  }

  logout(): void {
    this.#cookie.delete(TOKEN_KEY);
    this.token.set(undefined);
    this.#toastr.info('You have been logged out.', 'Goodbye');
    this.#router.navigate(['/auth/login']);
  }

  #setToken(token: string, expires?: Date): void {
    this.#cookie.set(TOKEN_KEY, token, {
      expires,
      secure: environment.production,
    });
    this.token.set(token);
  }
}
