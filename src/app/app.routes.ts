import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { profileRoutes } from './pages/profile/profile.routes';

export const routes: Routes = [...authRoutes, ...profileRoutes];
