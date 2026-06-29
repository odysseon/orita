import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { profileRoutes } from './pages/profile/profile.routes';
import { businessRoutes } from './pages/business/business.routes';
import { homeRoutes } from './pages/home/home.routes';

export const routes: Routes = [...authRoutes, ...homeRoutes, ...profileRoutes, ...businessRoutes];
