import { Route } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { businessRoutes } from './business/business.routes';
import { Profile } from './profile';
import { ProfileSubLayout } from './layout/profile-sub-layout';

export const profileRoutes: Route[] = [
  {
    path: 'profile',
    canActivate: [authGuard],
    component: Profile,
    data: { isRootAppPage: true },
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    component: ProfileSubLayout,
    children: [
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
        data: { title: 'Saved' },
        loadComponent: () => import('./saved/saved').then((m) => m.Saved),
      },
      ...businessRoutes,
    ],
  },
];
