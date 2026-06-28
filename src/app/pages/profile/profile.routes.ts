import { Route } from '@angular/router';
import { Profile } from './profile';
import { authGuard } from '../../core/guards/auth.guard';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: Profile,
    canActivate: [authGuard],
  },
];
