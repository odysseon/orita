import { Component, input, inject } from '@angular/core';
import { LucidePhone, LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../core/services/messaging.facade';

import { Button } from '../../../../shared/ui/atoms/button/button';
import { BusinessCard } from '../../../../shared/ui/organisms/cards/business-card/business-card';

@Component({
  selector: 'app-listing-business-card',
  imports: [LucidePhone, LucideMessageCircle, Button, BusinessCard],
  templateUrl: './listing-business-card.html',
  styleUrl: './listing-business-card.css',
})
export class ListingBusinessCard {
  biz = input.required<any>();
  listingId = input<string>(); // Added input to optionally pass listingId

  #messagingFacade = inject(MessagingFacade);

  callPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openWhatsapp(number: string): void {
    window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
  }

  onMessage(): void {
    const businessId = this.biz().id;
    if (!businessId) return;

    this.#messagingFacade.messageBusiness(businessId, this.listingId() ? {
      embedType: 'LISTING',
      targetId: this.listingId()!
    } : undefined);
  }
}
