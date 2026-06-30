import { Route } from '@angular/router';
import { Profile } from './profile';
import { authGuard } from '../../core/guards/auth.guard';
import { Saved } from './saved/saved';

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
];
