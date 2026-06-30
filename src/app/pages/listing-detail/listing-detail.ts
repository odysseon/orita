import { Component, computed, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {

  LucidePackage,
  LucideBookmark,
  LucideStore,
  LucideMessageCircle,
  LucidePhone,
  LucideStar,
  LucideMapPin,
} from '@lucide/angular';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast';
import { AppPageHeader } from '../../shared/page-header/page-header';
import { IBusinessLite, IListingDetail } from './listing.detail.interface';

@Component({
  selector: 'app-listing-detail',
  imports: [
    RouterLink,
    AppPageHeader,
    LucidePackage,
    LucideBookmark,
    LucideStore,
    LucideMessageCircle,
    LucidePhone,
    LucideStar,
    LucideMapPin,
  ],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.css',
})
export class ListingDetail {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly Math = Math;
  readonly saving = signal(false);

  readonly slug = computed(() => this.#route.snapshot.paramMap.get('slug') ?? '');

  readonly listing = httpResource<IListingDetail>(
    () => `${environment.apiUrl}/listings/${this.slug()}`,
  );

  readonly business = httpResource<IBusinessLite>(() => {
    const businessId = this.listing.value()?.businessProfileId;
    if (!businessId) return undefined;
    return `${environment.apiUrl}/businesses/${businessId}`;
  });

  readonly avgRating = computed(() => {
    const reviews = this.listing.value()?.reviews ?? [];
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  });

  readonly priceLabel = computed(() => {
    const item = this.listing.value();
    if (!item) return '';
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : 'Price on request';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  });

  goBack(): void {
    this.#router.navigate(['/home']);
  }

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  }

  async toggleSave(): Promise<void> {
    const item = this.listing.value();
    if (!item || this.saving()) return;
    this.saving.set(true);
    try {
      if (item.isSaved) {
        await firstValueFrom(this.#http.delete(`${environment.apiUrl}/listings/${item.id}/save`));
        this.#toast.info('Removed from saved');
      } else {
        await firstValueFrom(this.#http.post(`${environment.apiUrl}/listings/${item.id}/save`, {}));
        this.#toast.success('Saved');
      }
      this.listing.reload();
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
}
