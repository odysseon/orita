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
    path: 'location',
    loadComponent: () => import('./pages/location/location').then((m) => m.LocationSelection),
    canActivate: [() => import('./pages/location/location-required.guard').then((m) => m.locationRequiredGuard)],
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/sub-layout/sub-layout').then((m) => m.AppSubLayout),
    children: [
      {
        path: 'b/:slug',
        loadComponent: () => import('./pages/business-detail/business-detail').then((m) => m.BusinessDetail),
      },
      {
        path: 'l/:slug',
        loadComponent: () => import('./pages/listing-detail/listing-detail').then((m) => m.ListingDetail),
      },
      {
        path: 'tours/:id',
        loadComponent: () => import('./pages/tour-detail/tour-detail').then((m) => m.TourDetail),
      },
    ]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: { isRootAppPage: true },
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then((m) => m.Search),
    data: { isRootAppPage: true },
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
