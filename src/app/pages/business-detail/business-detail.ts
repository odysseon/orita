import { Component, computed, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
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
} from '@lucide/angular';
import { Logo } from '../../shared/logo/logo';
import { IBusinessDetail, IListingSummary, IPaginated } from './business-detail.interface';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast';
import { AppPageHeader } from '../../shared/page-header/page-header';
import { EmptyState } from '../../shared/empty-state/empty-state';

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
    AppPageHeader,
    EmptyState,
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
  ],
  templateUrl: './business-detail.html',
  styleUrl: './business-detail.css',
})
export class BusinessDetail {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly saving = signal(false);

  readonly slug = computed(() => this.#route.snapshot.paramMap.get('slug') ?? '');

  readonly business = httpResource<IBusinessDetail>(
    () => `${environment.apiUrl}/businesses/${this.slug()}`,
  );

  readonly listings = httpResource<IPaginated<IListingSummary>>(() => {
    const slug = this.slug();
    if (!slug) return undefined;
    return `${environment.apiUrl}/businesses/${slug}/listings`;
  });

  readonly verificationBadge = computed(() => {
    switch (this.business.value()?.verificationStatus) {
      case 'VERIFIED':
        return { label: 'Verified', cls: 'badge--success' };
      case 'PENDING':
        return { label: 'Pending review', cls: 'badge--warning' };
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

  async toggleSave(): Promise<void> {
    const biz = this.business.value();
    if (!biz || this.saving()) return;
    this.saving.set(true);
    try {
      if (biz.isSaved) {
        await firstValueFrom(
          this.#http.delete(`${environment.apiUrl}/business-profiles/${biz.id}/save`),
        );
        this.#toast.info('Removed from saved');
      } else {
        await firstValueFrom(
          this.#http.post(`${environment.apiUrl}/business-profiles/${biz.id}/save`, {}),
        );
        this.#toast.success('Saved');
      }
      this.business.reload();
    } catch {
      this.#toast.error('Could not update saved status');
    } finally {
      this.saving.set(false);
    }
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
