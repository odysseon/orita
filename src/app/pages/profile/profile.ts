import { Component, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LucideUser,
  LucideMapPin,
  LucideBuilding2,
  LucideBookmark,
  LucideShieldCheck,
  LucidePaintbrush,
  LucideChevronRight,
  LucideLogOut,
  LucideTriangleAlert,
  LucideDynamicIcon,
  LucideIconInput,
} from '@lucide/angular';
import { IProfile } from './profile.interface';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface NavItem {
  icon: LucideIconInput;
  label: string;
  description: string;
  route: string;
}

const ALWAYS_VISIBLE: NavItem[] = [
  {
    icon: LucideBookmark,
    label: 'Saved',
    description: 'Your saved listings and businesses',
    route: '/saved',
  },
  {
    icon: LucideShieldCheck,
    label: 'Privacy & Security',
    description: 'Edit profile and manage auth methods',
    route: '/settings/security',
  },
  {
    icon: LucidePaintbrush,
    label: 'Appearance',
    description: 'Customise how Orita looks for you',
    route: '/settings/appearance',
  },
];

const MY_BUSINESS: NavItem = {
  icon: LucideBuilding2,
  label: 'My Business',
  description: 'Manage your business profile',
  route: '/business',
};

@Component({
  selector: 'app-profile',
  imports: [
    LucideUser,
    LucideMapPin,
    LucideDynamicIcon,
    LucideChevronRight,
    LucideLogOut,
    LucideTriangleAlert,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  #auth = inject(AuthService);
  #router = inject(Router);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);

  readonly navItems = computed<NavItem[]>(() => {
    const hasBusiness = !!this.profile.value()?.businessId;
    return hasBusiness ? [MY_BUSINESS, ...ALWAYS_VISIBLE] : ALWAYS_VISIBLE;
  });

  navigate(route: string): void {
    this.#router.navigate([route]);
  }

  logout(): void {
    this.#auth.logout();
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(iso));
  }
}
