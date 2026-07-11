import { Routes } from '@angular/router';
import { LegalLayout } from './legal-layout/legal-layout';

export const legalRoutes: Routes = [
  {
    path: '',
    component: LegalLayout,
    children: [
      { path: '', redirectTo: 'privacy', pathMatch: 'full' },
      { path: 'privacy', loadComponent: () => import('./privacy/privacy').then(m => m.PrivacyPolicy) },
      { path: 'terms', loadComponent: () => import('./terms/terms').then(m => m.TermsOfService) },
      { path: 'community', loadComponent: () => import('./community/community').then(m => m.CommunityGuidelines) },
      { path: 'cookies', loadComponent: () => import('./cookies/cookies').then(m => m.CookiePolicy) },
    ]
  }
];
