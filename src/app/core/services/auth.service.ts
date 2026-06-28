import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from '../services/cookie';
import { ILogin, ILoginResponse } from '../../pages/auth/login/login.interface';
import { environment } from '../../../environments/environment.development';

const TOKEN_KEY = 'auth_token';

@Service()
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toastr = inject(ToastrService);
  #cookie = inject(CookieService);

  readonly token = signal<string | undefined>(this.#cookie.get(TOKEN_KEY));

  async login(credentials: ILogin & { remember: boolean }): Promise<void> {
    try {
      const { remember, ...payload } = credentials;
      const res = await firstValueFrom(
        this.#http.post<ILoginResponse>(`${environment.apiUrl}/auth/login`, payload),
      );
      this.#cookie.set(TOKEN_KEY, res.token, {
        expires: remember ? new Date(res.expiresAt) : undefined,
        secure: environment.production,
      });
      this.token.set(res.token);
      this.#toastr.success('Welcome back!', 'Logged in');
      await this.#router.navigate(['/']);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Login failed. Please try again.')
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
}
