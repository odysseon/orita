import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';

export const businessRoutes: Routes = [
  {
    path: 'business',
    canActivate: [authGuard],
    loadComponent: () => import('./business').then((m) => m.Business),
  },
  {
    path: 'business/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./edit/edit-business').then((m) => m.EditBusiness),
    data: { title: 'Edit Business' },
  },
  {
    path: 'business/listings/:listingId/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./listings/edit/edit-listing').then((m) => m.EditListing),
    data: { title: 'Edit Listing' },
  },
];
