import { Component, input, output, inject, signal, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { ShareButton } from '../../../actions/share-button/share-button';
import { ShareModalComponent } from '../../share-modal/share-modal';
import { Button } from '../../../atoms/button/button';
import { LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../../core/services/messaging.facade';
import { ListingSearchResult } from '../../search-results/listing-search-result/listing-search-result';

@Component({
  selector: 'ui-listing-card',
  standalone: true,
  imports: [CoverMedia, Card, ShareButton, ShareModalComponent, Button, LucideMessageCircle, ListingSearchResult],
  template: `
    <app-card appearance="plain" padding="none" [interactive]="true" class="ui-listing-card-container">
      <ui-cover-media [src]="listing().coverUrl" aspectRatio="4/3" [overlayGradient]="true"></ui-cover-media>
      <div class="ui-listing-card__body">
        <ui-listing-search-result
          [listing]="{
            id: listing().id,
            slug: listing().slug,
            title: listing().title,
            price: listing().price ?? 0,
            availability: listing().availability,
            isSaved: listing().isSaved
          }"
          [hideThumbnail]="true"
          [showSave]="showSave()"
          (saveToggle)="saveToggle.emit($event)">
        </ui-listing-search-result>

        <div class="ui-listing-card__actions">
          <div style="display: flex; align-items: center; gap: var(--size-8); flex: 1;">
            @if (showMessage() && listing().business) {
              <button app-button intent="secondary" size="sm" appearance="outline"
                (click)="$event.stopPropagation(); $event.preventDefault(); onMessage()" type="button">
                <svg lucideMessageCircle style="width: var(--size-14); height: var(--size-14); margin-right: var(--size-4);" aria-hidden="true"></svg>
                Message
              </button>
            }
          </div>
          @if (showShare()) {
            <div (click)="$event.stopPropagation(); $event.preventDefault()" style="flex-shrink: 0;">
              <ui-share-button size="sm" (share)="showShareModal.set(true)" />
            </div>
          }
        </div>
      </div>
    </app-card>

    @if (showShare()) {
      <ui-share-modal
        [isOpen]="showShareModal()"
        (close)="showShareModal.set(false)"
        embedType="LISTING"
        [targetId]="listing().id"
        [title]="listing().title"
        [imageUrl]="listing().coverUrl || undefined"
      />
    }
  `,
  styleUrl: './listing-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-listing-card]': 'true'
  }
})
export class ListingCard {
  #messagingFacade = inject(MessagingFacade);

  listing = input.required<{
    id: string;
    slug: string;
    title: string;
    coverUrl?: string | null;
    thumbnailUrl?: string | null;
    price?: number;
    availability?: string;
    isSaved?: boolean;
    business?: {
      id: string;
      name: string;
      slug?: string | null;
      logoUrl?: string | null;
      isVerified?: boolean;
      profileUrl?: any[] | string | null;
    } | null;
  }>();

  showSave = input<boolean>(true);
  showShare = input<boolean>(true);
  showMessage = input<boolean>(true);

  saveToggle = output<any>();

  readonly showShareModal = signal(false);

  onMessage(): void {
    const bizId = this.listing().business?.id;
    if (!bizId) return;
    this.#messagingFacade.messageBusiness(bizId, {
      embedType: 'LISTING',
      targetId: this.listing().id
    });
  }
}
