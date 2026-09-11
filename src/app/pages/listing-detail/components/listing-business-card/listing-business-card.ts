import { Component, input, inject, signal } from '@angular/core';
import { LucidePhone, LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../core/services/messaging.facade';
import { FollowService } from '../../../../core/services/follow.service';
import { ToastService } from '../../../../core/services/toast';
import { Button } from 'ur-ui';
import { BusinessCard } from '../../../../shared/ui/organisms/cards/business-card/business-card';
import { MessageButton } from '../../../../shared/ui/actions/message-button/message-button';

@Component({
  selector: 'app-listing-business-card',
  imports: [LucidePhone, LucideMessageCircle, Button, BusinessCard, MessageButton],
  templateUrl: './listing-business-card.html',
  styleUrl: './listing-business-card.css',
})
export class ListingBusinessCard {
  biz = input.required<any>();
  listingId = input<string>();

  #messagingFacade = inject(MessagingFacade);
  #followService = inject(FollowService);
  #toast = inject(ToastService);

  // Optimistic follow state
  readonly followOverride = signal<boolean | null>(null);

  isFollowed(): boolean {
    const override = this.followOverride();
    if (override !== null) return override;
    return !!this.biz().isFollowed;
  }

  callPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openWhatsapp(number: string): void {
    window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
  }

  onFollowToggle(wantToFollow: boolean): void {
    const businessId = this.biz().id;
    if (!businessId) return;

    this.followOverride.set(wantToFollow);
    const action$ = wantToFollow
      ? this.#followService.follow('business', businessId)
      : this.#followService.unfollow('business', businessId);

    action$.subscribe({
      error: () => {
        this.followOverride.set(!wantToFollow);
        this.#toast.error('Error', 'Could not update follow status.');
      },
    });
  }
}
