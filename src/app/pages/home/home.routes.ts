import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: 'home',
    data: { isRootAppPage: true },
    loadComponent: () => import('./home').then((m) => m.Home),
  },
];
