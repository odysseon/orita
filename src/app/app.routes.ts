import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/landing/landing.route').then((m) => m.landingRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/business-detail/business-detail.routes').then((m) => m.businessDetailRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/listing-detail/listing-detail.routes').then((m) => m.listingDetailRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
