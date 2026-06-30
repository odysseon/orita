import { Routes } from '@angular/router';
import { Home } from './home';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: Home,
    data: { isRootAppPage: true },
  },
];
