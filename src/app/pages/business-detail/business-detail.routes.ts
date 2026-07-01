import { Routes } from '@angular/router';

export const businessDetailRoutes: Routes = [
  {
    path: 'b/:slug',
    loadComponent: () => import('./business-detail').then((m) => m.BusinessDetail),
  },
];
