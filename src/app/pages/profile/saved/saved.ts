import { Component, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  LucideStore,
  LucidePackage,
  LucideBookmark,
  LucideX,
} from '@lucide/angular';
import { ISavedListingItem, IFollowedBusinessItem, IPaginated } from './saved.interface';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast';

type SavedTab = 'following' | 'listings';

@Component({
  selector: 'app-saved',
  imports: [RouterLink, LucideStore, LucidePackage, LucideBookmark, LucideX],
  templateUrl: './saved.html',
  styleUrl: './saved.css',
})
export class Saved {
  #router = inject(Router);
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly activeTab = signal<SavedTab>('following');
  readonly removingId = signal<string | null>(null);

  readonly followedBusinesses = httpResource<IPaginated<IFollowedBusinessItem>>(
    () => `${environment.apiUrl}/follows?type=business`,
  );

  readonly savedListings = httpResource<IPaginated<ISavedListingItem>>(
    () => `${environment.apiUrl}/users/me/saved-listings`,
  );

  setTab(tab: SavedTab): void {
    this.activeTab.set(tab);
  }



  formatPrice(item: ISavedListingItem['listing']): string {
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : '—';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  }

  async unfollowBusiness(businessProfileId: string): Promise<void> {
    this.removingId.set(businessProfileId);
    try {
      await firstValueFrom(
        this.#http.delete(`${environment.apiUrl}/follows/business/${businessProfileId}`),
      );
      this.#toast.info('Removed from saved');
      this.followedBusinesses.reload();
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
