import { Component, Input } from '@angular/core';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-listing-reviews',
  imports: [LucideStar],
  templateUrl: './listing-reviews.html',
  styleUrl: './listing-reviews.css',
})
export class ListingReviews {
  @Input() reviews!: any[];

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
}
