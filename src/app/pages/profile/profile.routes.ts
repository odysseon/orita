import { Route } from '@angular/router';
import { Profile } from './profile';
import { authGuard } from '../../core/guards/auth.guard';
import { Saved } from './saved/saved';
import { businessRoutes } from './business/business.routes';

export const profileRoutes: Route[] = [
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'profile/saved',
    component: Saved,
    canActivate: [authGuard],
  },
  ...businessRoutes,
];
