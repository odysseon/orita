import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { Business } from './business';


export const businessRoutes: Routes = [
  {
    path: 'profile/business',
    canActivate: [authGuard],
    component: Business,
  },
];
