import { Route } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { businessRoutes } from './business/business.routes';
import { Profile } from './profile';
import { ProfileSubLayout } from './layout/profile-sub-layout';
import { Saved } from './saved/saved';
import { Appearance } from './appearance/appearance';

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
        component: Appearance,
        data: { title: 'Appearance' },
      },
      {
        path: 'security',
        loadComponent: () => import('./security/security').then((m) => m.Security),
        data: { title: 'Privacy & Security' },
      },
      {
        path: 'saved',
        component: Saved,
        data: { title: 'Saved' },
      },
      ...businessRoutes,
    ],
  },
];
