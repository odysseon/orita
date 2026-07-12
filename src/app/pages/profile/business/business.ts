import { Component, computed, inject, signal, ViewChild, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {

  LucideStore,
  LucideImage,
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
import { CreateBusiness } from './create/create-business';
import { Listings } from './listings/listings';
import { AppBusinessTours } from './tours/tours';
import { CompletionNudge } from '../../../shared/completion-nudge/completion-nudge';
import { FirstListingCta } from './create/first-listing-cta/first-listing-cta';
import { AppBizCard } from '../../../shared/biz-card/biz-card';
import { IBusinessSummary } from '../../home/home.interface';
import { VisibilityScore } from '../../../shared/visibility-score/visibility-score';

@Component({
  selector: 'app-page-business',
  imports: [
    LucideStore,
    LucideImage,
    LucideMapPin,
    LucidePlus,
    LucideChartBar,
    LucideClock,
    LucideList,
    LucideEye,
    LucideBookmark,
    LucideMousePointerClick,
    LucideGlobe,
    LucideMail,
    LucidePhone,
    CreateBusiness,
    Listings,
    AppBusinessTours,
    CompletionNudge,
    FirstListingCta,
    AppBizCard,
    VisibilityScore,
  ],
  templateUrl: './business.html',
  styleUrl: './business.css',
})
export class Business implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  readonly business = httpResource<IBusinessProfile>(
    () => `${environment.apiUrl}/users/me/business`,
  );

  readonly stats = httpResource<IDashboardStats>(() => {
    const biz = this.business.value();
    return biz ? `${environment.apiUrl}/business/${biz.id}/dashboard-stats` : undefined;
  });

  readonly activeTab = signal<'overview' | 'hours' | 'listings' | 'tours'>('overview');
  readonly isCreateBusinessOpen = signal(false);
  readonly showFirstListingCta = signal(false);
  readonly hasBusiness = computed(() => {
    if (this.business.error()) return false;
    try {
      return !!this.business.value();
    } catch {
      return false;
    }
  });
  
  readonly businessSummary = computed<IBusinessSummary | null>(() => {
    if (this.business.error()) return null;
    let biz: IBusinessProfile | undefined;
    try {
      biz = this.business.value();
    } catch {
      return null;
    }
    if (!biz) return null;
    return {
      id: biz.id,
      name: biz.name,
      slug: biz.slug,
      description: biz.description ?? null,
      location: biz.location ?? null,
      latitude: biz.latitude ?? null,
      longitude: biz.longitude ?? null,
      categoryIds: [],
      isFollowed: false,
    };
  });

  @ViewChild(Listings) listingsCmp!: Listings;

  readonly isPublic = computed(() => {
    if (this.business.error()) return false;
    try {
      return this.business.value()?.isPublic ?? false;
    } catch {
      return false;
    }
  });

  readonly verificationBadge = computed(() => {
    return null; // Verification status is currently loaded separately
  });

  readonly isProfileIncomplete = computed(() => {
    if (this.business.error()) return false;
    let biz;
    try {
      biz = this.business.value();
    } catch {
      return false;
    }
    if (!biz) return false;
    // Basic checks: description, logo, cover
    return !biz.description || !biz.avatarUrl || !biz.coverUrl;
  });


  ngOnInit() {
    this.#route.queryParams.subscribe(params => {
      if (params['action'] === 'create') {
        this.isCreateBusinessOpen.set(true);
        this.clearQueryParam('action');
      } else if (params['action'] === 'first-listing') {
        this.showFirstListingCta.set(true);
      }
    });
  }

  private clearQueryParam(param: string) {
    this.#router.navigate([], {
      queryParams: { [param]: null },
      queryParamsHandling: 'merge'
    });
  }

  createBusiness(): void {
    this.isCreateBusinessOpen.set(true);
  }

  handleCreateFirstListing(): void {
    this.showFirstListingCta.set(false);
    this.clearQueryParam('action');
    this.setTab('listings');
    setTimeout(() => this.listingsCmp?.openForm(), 100);
  }

  dismissFirstListingCta(): void {
    this.showFirstListingCta.set(false);
    this.clearQueryParam('action');
  }

  handleVisibilityAction(actionId: string): void {
    if (actionId === 'create-listing') {
      this.handleCreateFirstListing();
    } else if (actionId === 'request-verify') {
      // For now, no-op or just navigate. We can add toast if needed
      // this.#toast.info('Verification', 'Coming soon!');
    }
  }

  editBusiness(): void {
    this.#router.navigate(['/profile/business/edit']);
  }

  onBusinessCreated(): void {
    this.business.reload();
  }

  setTab(tab: 'overview' | 'hours' | 'listings' | 'tours'): void {
    this.activeTab.set(tab);
  }
}
