import { Component, input, output, inject, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';
import { SaveButton } from '../../../actions/save-button/save-button';
import { ShareButton } from '../../../../share-button/share-button';
import { Button } from '../../../atoms/button/button';
import { LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../../core/services/messaging.facade';
import { ListingSearchResult } from '../../search-results/listing-search-result/listing-search-result';

@Component({
  selector: 'ui-listing-card',
  standalone: true,
  imports: [CoverMedia, Card, BusinessIdentity, SaveButton, ShareButton, Button, LucideMessageCircle, ListingSearchResult],
  template: `
    <app-card appearance="plain" padding="none" [interactive]="true" class="ui-listing-card-container">
      <ui-cover-media [src]="listing().coverUrl" aspectRatio="4/3" [overlayGradient]="true">
        <ng-content select="[card-media-overlay]"></ng-content>
      </ui-cover-media>
      <div class="ui-listing-card__body">
        <div>
          @if (listing().business; as business) {
            <div class="ui-listing-card__header" style="margin-bottom: var(--size-4);">
              <ui-business-identity [business]="business" size="sm" [showCategory]="false"></ui-business-identity>
            </div>
          }
          
          <ui-listing-search-result 
            [listing]="{
              id: listing().id,
              slug: listing().slug,
              title: listing().title,
              price: listing().price ?? 0,
              availability: listing().availability,
              isSaved: listing().isSaved
            }" 
            [hideThumbnail]="true">
            @if (showSave()) {
              <div result-action (click)="$event.stopPropagation()">
                <ui-save-button [isSaved]="listing().isSaved ?? false" (toggle)="saveToggle.emit(listing())" />
              </div>
            }
          </ui-listing-search-result>

          <div class="ui-listing-card__meta">
            <ng-content select="[card-meta]"></ng-content>
          </div>
        </div>
        
        <div class="ui-listing-card__actions">
          <div style="display: flex; align-items: center; gap: var(--size-8); flex: 1;">
            <ng-content select="[card-actions]"></ng-content>
            @if (showMessage() && listing().business) {
              <button app-button intent="secondary" size="sm" appearance="outline" (click)="onMessage($event)" type="button">
                <svg lucideMessageCircle style="width: var(--size-14); height: var(--size-14); margin-right: var(--size-4);" aria-hidden="true"></svg>
                Message
              </button>
            }
          </div>
          @if (showShare()) {
            <div (click)="$event.stopPropagation()" style="flex-shrink: 0;">
              <app-share-button [title]="listing().title" [text]="'Check out this listing on Orita'" [url]="getShareUrl()" variant="icon" size="sm" />
            </div>
          }
        </div>
      </div>
    </app-card>
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
    availability?: 'in-stock' | 'out-of-stock' | 'pre-order';
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

  onMessage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const bizId = this.listing().business?.id;
    if (!bizId) return;
    this.#messagingFacade.messageBusiness(bizId, {
      embedType: 'LISTING',
      targetId: this.listing().id
    });
  }

  getShareUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/l/${this.listing().slug}`;
    }
    return `/l/${this.listing().slug}`;
  }
}
