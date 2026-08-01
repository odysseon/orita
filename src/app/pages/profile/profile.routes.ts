import { Route } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { businessRoutes } from './business/business.routes';

export const profileRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./profile').then((m) => m.Profile),
    data: { isRootAppPage: true },
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../../shared/layout/sub-layout/sub-layout').then((m) => m.AppSubLayout),
    children: [
      {
        path: 'preferences',
        data: { title: 'Discovery Preferences' },
        loadComponent: () => import('./preferences/preferences').then((m) => m.ProfilePreferences),
      },
      {
        path: 'appearance',
        data: { title: 'Appearance' },
        loadComponent: () => import('./appearance/appearance').then((m) => m.Appearance),
      },
      {
        path: 'security',
        data: { title: 'Privacy & Security' },
        loadComponent: () => import('./security/security').then((m) => m.Security),
      },
      {
        path: 'edit',
        data: { title: 'Edit Profile' },
        loadComponent: () => import('./edit/edit-profile').then((m) => m.EditProfile),
      },
      {
        path: 'saved',
        data: { title: 'Library' },
        loadComponent: () => import('./saved/saved').then((m) => m.Saved),
      },
      {
        path: 'opportunities',
        data: { title: 'My Opportunities' },
        loadComponent: () => import('./opportunities/opportunities').then((m) => m.MyOpportunities),
      },
      ...businessRoutes,
    ],
  },
];
