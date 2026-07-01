import { Routes } from '@angular/router';
import { Home } from './home';

export const homeRoutes: Routes = [
  {
    path: 'home',
    data: { isRootAppPage: true },
    component: Home,
  },
];
