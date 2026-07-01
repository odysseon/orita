import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { Business } from './business';
import { EditBusiness } from './edit/edit-business';

export const businessRoutes: Routes = [
  {
    path: 'business',
    canActivate: [authGuard],
    component: Business,
  },
  {
    path: 'business/edit',
    canActivate: [authGuard],
    component: EditBusiness,
    data: { title: 'Edit Business' },
  },
];
