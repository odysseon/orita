import { Component, input, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { BusinessIdentity } from '../../../molecules/identity/business-identity/business-identity';

@Component({
  selector: 'ui-store-tour-card',
  standalone: true,
  imports: [CoverMedia, Card, BusinessIdentity],
  template: `
    <app-card appearance="plain" padding="none" [interactive]="true" class="ui-store-tour-card-container">
      <div class="ui-store-tour-card__media">
        <ui-cover-media [src]="tour().thumbnailUrl" aspectRatio="16/9" [overlayGradient]="true">
          <ng-content select="[card-media-overlay]"></ng-content>
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
        <div class="ui-store-tour-card__actions">
          <ng-content select="[card-actions]"></ng-content>
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
    business: {
      id: string;
      name: string;
      logoUrl?: string | null;
      isVerified?: boolean;
    };
  }>();
}
