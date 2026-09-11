import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LucideUser,
  LucideBuilding2,
  LucideBookmark,
  LucideShieldCheck,
  LucidePaintbrush,
  LucideChevronRight,
  LucideLogOut,
  LucideTriangleAlert,
  LucideDynamicIcon,
  LucideList,
  LucideIconInput,
  LucideMapPin,
} from '@lucide/angular';
import { IProfile } from './profile.interface';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { CreateBusiness } from './business/create/create-business';
import { List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd } from 'ur-ui';
import { SeoComponent } from '../../shared/seo/seo.component';
import { PageHeader } from '../../shared/ui/organisms/page-header/page-header';
import { Avatar } from 'ur-ui';

import { Skeleton } from 'ur-ui';
import { Button } from 'ur-ui';

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
    icon: LucideList,
    label: 'Discovery Preferences',
    description: 'Personalize your feed and interests',
    route: '/profile/preferences',
  },
  {
    icon: LucideShieldCheck,
    label: 'Privacy & Security',
    description: 'Manage auth methods and account security',
    route: '/profile/security',
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
  label: 'Library',
  description: 'Your saved listings and businesses',
  route: '/profile/saved',
};

const MY_BUSINESS: NavItem = {
  icon: LucideBuilding2,
  label: 'My Business',
  description: 'Manage your business profile',
  route: '/profile/business',
};

const MY_OPPORTUNITIES: NavItem = {
  icon: LucideMapPin,
  label: 'My Opportunities',
  description: 'Manage your local posts and requests',
  route: '/profile/opportunities',
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
    LucideDynamicIcon,
    LucideChevronRight,
    LucideLogOut,
    LucideTriangleAlert,
    CreateBusiness,
    SeoComponent,
    PageHeader,
    Avatar,
    Button,
    Skeleton,
    List,
    ListItem,
    ListItemStart,
    ListItemContent,
    ListItemTitle,
    ListItemDescription,
    ListItemEnd,
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
        items: [businessItem, MY_OPPORTUNITIES, SAVED_ITEM],
      },
      {
        title: 'Account Settings',
        items: ALWAYS_VISIBLE_SETTINGS,
      },
    ];
  });

  readonly seoConfig = computed(() => {
    const p = this.profile.value();
    return {
      title: p ? `${p.username}'s Profile` : 'Profile',
      description: 'Manage your Orita account, business, and saved items.',
    };
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
