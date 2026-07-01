import { Route } from '@angular/router';
import { Landing } from './landing';

export const landingRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: Landing,
    data: { isRootAppPage: true, isLandingPage: true },
  },
];
