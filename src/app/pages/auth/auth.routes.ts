import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';
import { Login } from './login/login';
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
