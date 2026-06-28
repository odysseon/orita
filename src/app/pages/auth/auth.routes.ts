import { Routes } from '@angular/router';
import { Login } from './login/login';

export const authRoutes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login,
      },
    ],
  },
];
