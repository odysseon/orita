import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';
import { SaveButton } from '../../../actions/save-button/save-button';
import { ShareButton } from '../../../../share-button/share-button';

@Component({
  selector: 'ui-store-tour-card',
  standalone: true,
  imports: [CoverMedia, Card, BusinessIdentity, SaveButton, ShareButton],
  template: `
    <app-card appearance="plain" padding="none" [interactive]="true" class="ui-store-tour-card-container">
      <div class="ui-store-tour-card__media">
        <ui-cover-media [src]="tour().thumbnailUrl" aspectRatio="16/9" [overlayGradient]="true">
          <div style="position: absolute; top: var(--size-10); right: var(--size-10); display: flex; gap: var(--size-6); z-index: 2;">
            <ng-content select="[card-media-overlay]"></ng-content>
            @if (showSave()) {
              <ui-save-button [isSaved]="tour().isSaved ?? false" (toggle)="saveToggle.emit(tour())" />
            }
          </div>
        </ui-cover-media>
      </div>
      <div class="ui-store-tour-card__body">
        <div class="ui-store-tour-card__header">
          <ui-business-identity [business]="tour().business" size="sm" [showCategory]="false"></ui-business-identity>
        </div>
        <h3 class="ui-store-tour-card__title truncate">{{ tour().title }}</h3>
        <div class="ui-store-tour-card__summary truncate-2">
          <ng-content select="[card-summary]"></ng-content>
        </div>
        <div class="ui-store-tour-card__actions" style="display: flex; align-items: center; justify-content: space-between; gap: var(--size-8); margin-top: var(--size-8);">
          <div style="flex: 1;">
            <ng-content select="[card-actions]"></ng-content>
          </div>
          @if (showShare()) {
            <div (click)="$event.stopPropagation()" style="flex-shrink: 0;">
              <app-share-button [title]="tour().title" [text]="'Check out this store tour on Orita'" [url]="getShareUrl()" variant="icon" size="sm" />
            </div>
          }
        </div>
      </div>
    </app-card>
  `,
  styleUrl: './store-tour-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-store-tour-card]': 'true'
  }
})
export class StoreTourCard {
  tour = input.required<{
    id: string;
    title: string;
    thumbnailUrl?: string | null;
    isSaved?: boolean;
    business: {
      id: string;
      name: string;
      slug?: string | null;
      logoUrl?: string | null;
      isVerified?: boolean;
      profileUrl?: any[] | string | null;
    };
  }>();

  showSave = input<boolean>(true);
  showShare = input<boolean>(true);
  saveToggle = output<any>();

  getShareUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/tours/${this.tour().id}`;
    }
    return `/tours/${this.tour().id}`;
  }
}
