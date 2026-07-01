import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { profileRoutes } from './pages/profile/profile.routes';
import { homeRoutes } from './pages/home/home.routes';
import { landingRoutes } from './pages/landing/landing.route';
import { businessDetailRoutes } from './pages/business-detail/business-detail.routes';
import { listingDetailRoutes } from './pages/listing-detail/listing-detail.routes';
export const routes: Routes = [
  ...authRoutes,
  ...businessDetailRoutes,
  ...homeRoutes,
  ...landingRoutes,
  ...listingDetailRoutes,
  ...profileRoutes,
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
  }
];
