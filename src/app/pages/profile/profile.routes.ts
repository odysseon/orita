import { Route } from '@angular/router';
import { Profile } from './profile';
import { authGuard } from '../../core/guards/auth.guard';

export const profileRoutes: Route[] = [
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
];
