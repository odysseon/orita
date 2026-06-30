import { Component, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  LucideArrowLeft,
  LucideStore,
  LucidePackage,
  LucideBookmark,
  LucideX,
} from '@lucide/angular';
import { ISavedListingItem, ISavedBusinessItem, IPaginated } from './saved.interface';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast';

type SavedTab = 'businesses' | 'listings';

@Component({
  selector: 'app-saved',
  imports: [RouterLink, LucideArrowLeft, LucideStore, LucidePackage, LucideBookmark, LucideX],
  templateUrl: './saved.html',
  styleUrl: './saved.css',
})
export class Saved {
  #router = inject(Router);
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly activeTab = signal<SavedTab>('businesses');
  readonly removingId = signal<string | null>(null);

  readonly savedBusinesses = httpResource<IPaginated<ISavedBusinessItem>>(
    () => `${environment.apiUrl}/users/me/saved-businesses`,
  );

  readonly savedListings = httpResource<IPaginated<ISavedListingItem>>(
    () => `${environment.apiUrl}/users/me/saved-listings`,
  );

  setTab(tab: SavedTab): void {
    this.activeTab.set(tab);
  }

  goBack(): void {
    this.#router.navigate(['/profile']);
  }

  formatPrice(item: ISavedListingItem['listing']): string {
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : '—';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  }

  async unsaveBusiness(businessProfileId: string): Promise<void> {
    this.removingId.set(businessProfileId);
    try {
      await firstValueFrom(
        this.#http.delete(`${environment.apiUrl}/business-profiles/${businessProfileId}/save`),
      );
      this.#toast.info('Removed from saved');
      this.savedBusinesses.reload();
    } catch {
      this.#toast.error('Could not remove business');
    } finally {
      this.removingId.set(null);
    }
  }

  async unsaveListing(listingId: string): Promise<void> {
    this.removingId.set(listingId);
    try {
      await firstValueFrom(this.#http.delete(`${environment.apiUrl}/listings/${listingId}/save`));
      this.#toast.info('Removed from saved');
      this.savedListings.reload();
    } catch {
      this.#toast.error('Could not remove listing');
    } finally {
      this.removingId.set(null);
    }
  }
}
