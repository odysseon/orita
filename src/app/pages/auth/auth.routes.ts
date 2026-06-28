import { Routes } from '@angular/router';
import { Login } from './login/login';
import { guestGuard } from '../../core/guards/guest.guard';
import { Register } from './register/register';

export const authRoutes: Routes = [
  {
    path: 'auth',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
];
