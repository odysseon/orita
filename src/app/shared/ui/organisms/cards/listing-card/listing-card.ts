import { Component, input, output, inject, signal, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { ShareButton } from '../../../actions/share-button/share-button';
import { ShareModalComponent } from '../../share-modal/share-modal';
import { Button } from '../../../atoms/button/button';
import { LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../../core/services/messaging.facade';
import { ListingSearchResult } from '../../search-results/listing-search-result/listing-search-result';

import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { SaveButton } from '../../../actions/save-button/save-button';

@Component({
  selector: 'ui-listing-card',
  standalone: true,
  imports: [CoverMedia, Card, ShareButton, ShareModalComponent, Button, LucideMessageCircle, RouterLink, CurrencyPipe, SaveButton],
  template: `
    <a [routerLink]="['/l', listing().slug || listing().id]" style="text-decoration: none; color: inherit; display: block;">
      <app-card appearance="plain" padding="none" [interactive]="true" class="ui-listing-card-container">
        <ui-cover-media [src]="listing().coverUrl" aspectRatio="4/3" [overlayGradient]="true"></ui-cover-media>
        <div class="ui-listing-card__body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--size-8);">
            <div style="flex: 1; min-width: 0;">
              <div class="truncate" style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-md);">{{ listing().title }}</div>
              <div style="display: flex; align-items: center; gap: var(--size-8); margin-top: var(--size-4);">
                <span style="font-weight: var(--font-weight-medium);">{{ (listing().price || 0) | currency:'NGN':'symbol-narrow':'1.0-0' }}</span>
                @if (listing().availability === 'IN_STOCK') {
                  <span style="font-size: var(--font-size-xs); color: var(--text-secondary);">In Stock</span>
                } @else if (listing().availability === 'OUT_OF_STOCK') {
                  <span style="font-size: var(--font-size-xs); color: var(--text-secondary);">Out of Stock</span>
                } @else if (listing().availability === 'PRE_ORDER') {
                  <span style="font-size: var(--font-size-xs); color: var(--clr-warning);">Pre-order</span>
                }
              </div>
            </div>
            @if (showSave()) {
              <div (click)="$event.preventDefault(); $event.stopPropagation()">
                <ui-save-button [isSaved]="listing().isSaved ?? false" (toggle)="saveToggle.emit($event)"></ui-save-button>
              </div>
            }
          </div>

        <div class="ui-listing-card__actions" style="display: flex; align-items: center; justify-content: space-between; gap: var(--size-8); margin-top: var(--size-8); padding-top: var(--size-8); border-top: 1px solid var(--border-subtle);">
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
    </a>

    @if (showShare()) {
      <ui-share-modal
        [isOpen]="showShareModal()"
        (close)="showShareModal.set(false)"
        embedType="LISTING"
        [targetId]="listing().id"
        [targetSlug]="listing().slug || undefined"
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
