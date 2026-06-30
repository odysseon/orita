import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePackage, LucideBookmark } from '@lucide/angular';
import { IListingSummary } from '../../pages/home/home.interface';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, LucidePackage, LucideBookmark],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css'
})
export class AppListingCard {
  readonly item = input.required<IListingSummary>();

  formatPrice(item: IListingSummary): string {
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : '—';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  }
}
