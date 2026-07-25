import { Component, computed, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {

  LucideStore,
  LucideMapPin,
  LucidePhone,
  LucideMail,
  LucideGlobe,
  LucideMessageCircle,
  LucideClock,
  LucideBookmark,
  LucidePackage,
  LucideBadgeCheck,
  LucideImage,
  LucideInfo,
  LucideSend,
} from '@lucide/angular';
import { Badge } from '../../shared/ui/atoms/badge/badge';
import { Skeleton } from '../../shared/ui/atoms/skeleton/skeleton';
import { IBusinessDetail, IListingSummary, IPaginated } from './business-detail.interface';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast';
import { ShareButton } from '../../shared/share-button/share-button';
import { ShareModalComponent } from '../../shared/components/share-modal/share-modal';
import { FollowButton } from '../../shared/follow-button/follow-button';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SeoComponent } from '../../shared/seo/seo.component';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';
import { LayoutPage } from '../../shared/layout/sub-layout/layout-page.interface';

const DAY_LABELS: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

@Component({
  selector: 'app-business-detail',
  imports: [
    RouterLink,
    ShareButton,
    FollowButton,
    EmptyState,
    SeoComponent,
    LucideStore,
    LucideMapPin,
    LucidePhone,
    LucideMail,
    LucideGlobe,
    LucideMessageCircle,
    LucideClock,
    LucidePackage,
    LucideBadgeCheck,
    LucideImage,
    LucideInfo,
    LucideSend,
    DatePipe,
    ShareModalComponent,
    Badge,
    Skeleton
  ],
  templateUrl: './business-detail.html',
  styleUrl: './business-detail.css',
})
export class BusinessDetail implements LayoutPage {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #http = inject(HttpClient);
  #tourService = inject(BusinessTourService);

  readonly showShareModal = signal(false);

  readonly slug = computed(() => this.#route.snapshot.paramMap.get('slug') ?? '');

  readonly business = httpResource<IBusinessDetail>(
    () => `${environment.apiUrl}/businesses/${this.slug()}`,
  );

  readonly pageTitle = computed(() => this.business.value()?.name);

  readonly listings = httpResource<IPaginated<IListingSummary>>(() => {
    const slug = this.slug();
    if (!slug) return undefined;
    return `${environment.apiUrl}/businesses/${slug}/listings`;
  });

  readonly tours = httpResource<{ items: IBusinessTour[]; total: number }>(() => {
    const bizId = this.business.value()?.id;
    if (!bizId) return undefined;
    return `${environment.apiUrl}/business-profiles/${bizId}/business-tours?status=PUBLISHED&limit=20`;
  });

  readonly verificationBadge = computed(() => {
    switch (this.business.value()?.verificationStatus) {
      case 'VERIFIED':
        return { label: 'Verified', intent: 'success' as const };
      case 'PENDING':
        return { label: 'Pending review', intent: 'warning' as const };
      default:
        return null;
    }
  });

  readonly groupedHours = computed(() => {
    const hours = this.business.value()?.operatingHours ?? [];
    return hours
      .slice()
      .sort(
        (a, b) => Object.keys(DAY_LABELS).indexOf(a.day) - Object.keys(DAY_LABELS).indexOf(b.day),
      );
  });

  readonly seoConfig = computed(() => {
    const biz = this.business.value();
    if (!biz) return { title: 'Business' };
    
    return {
      title: biz.name,
      description: biz.description || `Visit ${biz.name} on Orita.`,
      image: biz.coverUrl || biz.avatarUrl || undefined,
      url: `https://orita.onrender.com/b/${biz.slug}`,
      type: 'profile' as const,
      jsonLd: {
        "@type": "LocalBusiness",
        "name": biz.name,
        "image": biz.coverUrl || biz.avatarUrl,
        "description": biz.description,
        "telephone": biz.phoneNumber,
        "email": biz.email,
        "address": biz.location ? {
           "@type": "PostalAddress",
           "streetAddress": biz.location
        } : undefined
      }
    };
  });

  goBack(): void {
    this.#router.navigate(['/home']);
  }

  dayLabel(day: string): string {
    return DAY_LABELS[day] ?? day;
  }

  formatPrice(item: IListingSummary): string {
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : '—';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  }



  callPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openWhatsapp(number: string): void {
    window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
