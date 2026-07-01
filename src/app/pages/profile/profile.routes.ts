import { Route } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { businessRoutes } from './business/business.routes';

export const profileRoutes: Route[] = [
  {
    path: 'profile',
    loadComponent: () => import('./profile').then(m => m.Profile),
    canActivate: [authGuard],
    data: { isRootAppPage: true },
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/profile-sub-layout').then(m => m.ProfileSubLayout),
    children: [
      {
        path: 'saved',
        loadComponent: () => import('./saved/saved').then(m => m.Saved),
        data: { title: 'Saved' },
      },
      ...businessRoutes,
    ],
  },
];
