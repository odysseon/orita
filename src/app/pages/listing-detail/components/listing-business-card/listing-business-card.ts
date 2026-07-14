import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideStore, LucideMapPin, LucidePhone, LucideMessageCircle } from '@lucide/angular';

@Component({
  selector: 'app-listing-business-card',
  imports: [RouterLink, LucideStore, LucideMapPin, LucidePhone, LucideMessageCircle],
  templateUrl: './listing-business-card.html',
  styleUrl: './listing-business-card.css',
})
export class ListingBusinessCard {
  @Input() biz!: any;

  callPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openWhatsapp(number: string): void {
    window.open(`https://wa.me/${number.replace(/\\D/g, '')}`, '_blank');
  }
}
