import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { Business } from './business';
import { CreateBusiness } from './create/create-business';

export const businessRoutes: Routes = [
  {
    path: 'business',
    canActivate: [authGuard],
    component: Business,
  },
  {
    path: 'business/create',
    canActivate: [authGuard],
    component: CreateBusiness,
  },
];
