import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

const SKIP_ENDPOINTS = ['/auth/login', '/accounts/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();
  const isApi = req.url.startsWith(environment.apiUrl);
  const isSkipped = SKIP_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  if (token && isApi && !isSkipped) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  const platformId = inject(PLATFORM_ID);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isSkipped) {
        if (isPlatformBrowser(platformId)) {
          authService.logout(true, router.url);
        }
      }
      return throwError(() => error);
    })
  );
};
