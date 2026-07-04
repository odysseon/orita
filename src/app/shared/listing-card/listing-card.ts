import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePackage, LucideBookmark } from '@lucide/angular';
import { IListingSummary } from '../../pages/home/home.interface';
import { SaveService } from '../../core/services/save.service';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, LucidePackage, LucideBookmark],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css'
})
export class AppListingCard {
  readonly item = input.required<IListingSummary>();
  #saveService = inject(SaveService);

  formatPrice(item: IListingSummary): string {
    if (!item.minPrice) return 'Contact for price';
    const currency = item.currencyCode || 'NGN';
    const min = new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(item.minPrice));
    
    if (item.maxPrice && item.minPrice !== item.maxPrice) {
      const max = new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(item.maxPrice));
      return `${min} - ${max}`;
    }
    return min;
  }

  toggleSave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const current = this.item().isSaved;
    this.item().isSaved = !current; // Optimistic update
    
    this.#saveService.toggleSaveListing(this.item().id, !!current).subscribe({
      error: () => {
        // Revert on failure
        this.item().isSaved = current;
      }
    });
  }
}
