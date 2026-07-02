import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
    data: { isRootAppPage: true, isLandingPage: true },
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'b/:slug',
    loadComponent: () => import('./pages/business-detail/business-detail').then((m) => m.BusinessDetail),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: { isRootAppPage: true },
  },
  {
    path: 'l/:slug',
    loadComponent: () => import('./pages/listing-detail/listing-detail').then((m) => m.ListingDetail),
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
