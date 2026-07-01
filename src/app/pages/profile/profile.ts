import { Component, computed, inject, signal } from '@angular/core';
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
import { CreateBusiness } from './business/create/create-business';

interface NavItem {
  icon: LucideIconInput;
  label: string;
  description: string;
  route?: string;
  action?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALWAYS_VISIBLE_SETTINGS: NavItem[] = [
  {
    icon: LucideShieldCheck,
    label: 'Privacy & Security',
    description: 'Edit profile and manage auth methods',
    route: '/profile/settings/security',
  },
  {
    icon: LucidePaintbrush,
    label: 'Appearance',
    description: 'Customise how Orita looks for you',
    route: '/profile/appearance',
  },
];

const SAVED_ITEM: NavItem = {
  icon: LucideBookmark,
  label: 'Saved',
  description: 'Your saved listings and businesses',
  route: '/profile/saved',
};

const MY_BUSINESS: NavItem = {
  icon: LucideBuilding2,
  label: 'My Business',
  description: 'Manage your business profile',
  route: '/profile/business',
};

const START_BUSINESS: NavItem = {
  icon: LucideBuilding2,
  label: 'Start a Business',
  description: 'Create a profile and reach customers on Orita',
  action: 'create-business',
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
    CreateBusiness,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  #auth = inject(AuthService);
  #router = inject(Router);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly isCreateBusinessOpen = signal(false);

  readonly navGroups = computed<NavGroup[]>(() => {
    const businessItem = this.profile.value()?.businessId ? MY_BUSINESS : START_BUSINESS;
    return [
      {
        title: 'Workspace',
        items: [businessItem, SAVED_ITEM],
      },
      {
        title: 'Account Settings',
        items: ALWAYS_VISIBLE_SETTINGS,
      },
    ];
  });

  navigate(item: NavItem): void {
    if (item.action === 'create-business') {
      this.isCreateBusinessOpen.set(true);
      return;
    }
    if (item.route) {
      this.#router.navigate([item.route]);
    }
  }

  onBusinessCreated(): void {
    this.profile.reload();
    this.#router.navigate(['/profile/business']);
  }

  logout(): void {
    this.#auth.logout();
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(iso));
  }
}
