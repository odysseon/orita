import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

const SKIP_ENDPOINTS = ['/auth/login', '/accounts/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const isApi = req.url.startsWith(environment.apiUrl);
  const isSkipped = SKIP_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  if (token && isApi && !isSkipped) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
