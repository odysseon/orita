import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import {

  LucideStore,
  LucidePlus,
  LucideChartBar,
  LucideClock,
  LucideList,
  LucideEye,
  LucideBookmark,
  LucideMousePointerClick,
  LucideMapPin,
  LucideMail,
  LucidePhone,
  LucideGlobe,
} from '@lucide/angular';
import { IBusinessProfile, IDashboardStats } from './business.interface';
import { environment } from '../../../../environments/environment';
import { AppPageHeader } from '../../../shared/page-header/page-header';
import { Listings } from './listings/listings';
import { CreateBusiness } from './create/create-business';

@Component({
  selector: 'app-business',
  imports: [
    Listings,
    AppPageHeader,
    CreateBusiness,
    LucideStore,
    LucidePlus,
    LucideChartBar,
    LucideClock,
    LucideList,
    LucideEye,
    LucideBookmark,
    LucideMousePointerClick,
    LucideMapPin,
    LucideMail,
    LucidePhone,
    LucideGlobe,
  ],
  templateUrl: './business.html',
  styleUrl: './business.css',
})
export class Business {
  #router = inject(Router);

  readonly business = httpResource<IBusinessProfile>(
    () => `${environment.apiUrl}/users/me/business`,
  );

  readonly stats = httpResource<IDashboardStats>(() => {
    const biz = this.business.value();
    return biz ? `${environment.apiUrl}/business/${biz.id}/dashboard-stats` : undefined;
  });

  readonly activeTab = signal<'overview' | 'hours' | 'listings'>('overview');
  readonly isCreateBusinessOpen = signal(false);
  readonly hasBusiness = computed(() => !!this.business.value());

  readonly isPublic = computed(() => this.business.value()?.isPublic ?? false);

  readonly verificationBadge = computed(() => {
    const status = this.business.value()?.verificationStatus;
    if (status === 'VERIFIED') return { label: 'Verified', cls: 'badge--verified' };
    if (status === 'PENDING') return { label: 'Verification pending', cls: 'badge--pending' };
    if (status === 'REJECTED') return { label: 'Verification rejected', cls: 'badge--rejected' };
    return { label: 'Unverified', cls: 'badge--unverified' };
  });

  goBack(): void {
    this.#router.navigate(['/profile']);
  }

  createBusiness(): void {
    this.isCreateBusinessOpen.set(true);
  }

  onBusinessCreated(): void {
    this.business.reload();
  }

  setTab(tab: 'overview' | 'hours' | 'listings'): void {
    this.activeTab.set(tab);
  }
}
