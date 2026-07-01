import { Route } from '@angular/router';

export const landingRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing').then(m => m.Landing),
    data: { isRootAppPage: true, isLandingPage: true },
  }
];
