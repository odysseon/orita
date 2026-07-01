import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';

export const businessRoutes: Routes = [
  {
    path: 'business',
    canActivate: [authGuard],
    loadComponent: () => import('./business').then(m => m.Business),
  },
];
