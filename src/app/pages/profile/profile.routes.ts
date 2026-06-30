import { Route } from '@angular/router';
import { Profile } from './profile';
import { authGuard } from '../../core/guards/auth.guard';
import { Saved } from './saved/saved';
import { businessRoutes } from './business/business.routes';
import { ProfileSubLayout } from './layout/profile-sub-layout';

export const profileRoutes: Route[] = [
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    component: ProfileSubLayout,
    children: [
      {
        path: 'saved',
        component: Saved,
        data: { title: 'Saved' },
      },
      ...businessRoutes,
    ],
  },
];
