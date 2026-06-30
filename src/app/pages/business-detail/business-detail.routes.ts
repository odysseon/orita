import { Routes } from '@angular/router';
import { BusinessDetail } from './business-detail';

export const businessDetailRoutes: Routes = [
  {
    path: 'b/:slug',
    component: BusinessDetail,
  },
];
