import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
    data: { isRootAppPage: true },
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
    path: 'u/:username',
    loadComponent: () => import('./pages/public-profile/public-profile').then((m) => m.PublicProfile),
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
    path: 'tours',
    loadComponent: () => import('./pages/tours/tours').then((m) => m.ToursPage),
    data: { isRootAppPage: true },
  },
  {
    path: 'nearby',
    loadComponent: () => import('./pages/nearby/nearby').then((m) => m.NearbyPage),
    data: { isRootAppPage: true },
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages').then((m) => m.MessagesPage),
    data: { isRootAppPage: true },
  },
  {
    path: 'messages/:id',
    loadComponent: () => import('./pages/messages/messages').then((m) => m.MessagesPage),
    data: { isRootAppPage: true },
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications').then((m) => m.NotificationsPage),
    data: { isRootAppPage: true },
  },
  {
    path: 'legal',
    loadChildren: () => import('./pages/legal/legal.routes').then((m) => m.legalRoutes),
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
