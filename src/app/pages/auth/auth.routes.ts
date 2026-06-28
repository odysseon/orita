import { Routes } from '@angular/router';
import { Login } from './login/login';
import { guestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        component: Login,
      },
    ],
  },
];
