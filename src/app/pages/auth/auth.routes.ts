import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then((m) => m.Register),
      },
    ],
  },
];
