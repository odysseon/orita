import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home').then(m => m.Home),
    data: { isRootAppPage: true },
  },
];
