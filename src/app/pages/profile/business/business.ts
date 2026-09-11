import { Component, computed, inject, signal, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
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
import { BusinessCard } from '../../../shared/ui/organisms/cards/business-card/business-card';
import { Button } from 'ur-ui';
import { Skeleton } from 'ur-ui';
import { Avatar } from 'ur-ui';
import { IBusinessSummary } from '../../home/home.interface';
import { VisibilityScore } from '../../../shared/visibility-score/visibility-score';
import { BusinessProfileService, PublicationIssue } from '../../../core/services/business-profile.service';
import { PublicationReadinessDialog } from '../../../shared/publication-readiness/publication-readiness';
import { ToastService } from '../../../core/services/toast';
import { BusinessOverview } from './components/business-overview';
import { BusinessHours } from './components/business-hours';

@Component({
  selector: 'app-page-business',
  imports: [
    Button,
    Skeleton,
    Avatar,
    CreateBusiness,
    Listings,
    AppBusinessTours,
    CompletionNudge,
    FirstListingCta,
    PublicationReadinessDialog,
    BusinessOverview,
    BusinessHours,
  ],
  templateUrl: './business.html',
  styleUrl: './business.css',
  encapsulation: ViewEncapsulation.None,
})
export class Business implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #businessService = inject(BusinessProfileService);
  #toast = inject(ToastService);

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
  readonly isReadinessDialogOpen = signal(false);
  readonly readinessIssues = signal<PublicationIssue[]>([]);
  readonly isPublishing = signal(false);

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

  async publishBusiness(): Promise<void> {
    const biz = this.business.value();
    if (!biz) return;
    
    this.isPublishing.set(true);
    try {
      const readiness = await this.#businessService.checkReadiness(biz.id);
      if (!readiness.ready) {
        this.readinessIssues.set(readiness.issues);
        this.isReadinessDialogOpen.set(true);
        return;
      }
      
      await this.#businessService.publish(biz.id);
      this.#toast.success('Published', 'Your business is now public!');
      this.business.reload();
    } catch (err) {
      this.#toast.error('Error', 'Failed to publish business.');
    } finally {
      this.isPublishing.set(false);
    }
  }

  async unpublishBusiness(): Promise<void> {
    const biz = this.business.value();
    if (!biz) return;
    
    this.isPublishing.set(true);
    try {
      await this.#businessService.unpublish(biz.id);
      this.#toast.success('Unpublished', 'Your business is now private.');
      this.business.reload();
    } catch (err) {
      this.#toast.error('Error', 'Failed to unpublish business.');
    } finally {
      this.isPublishing.set(false);
    }
  }

  closeReadinessDialog(): void {
    this.isReadinessDialogOpen.set(false);
  }
}
