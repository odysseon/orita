import { Component, input, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';

@Component({
  selector: 'ui-listing-card',
  standalone: true,
  imports: [CoverMedia, Card],
  template: `
    <app-card appearance="plain" padding="none" [interactive]="true" class="ui-listing-card-container">
      <ui-cover-media [src]="listing().coverUrl" aspectRatio="4/3" [overlayGradient]="true">
        <ng-content select="[card-media-overlay]"></ng-content>
      </ui-cover-media>
      <div class="ui-listing-card__body">
        <h3 class="ui-listing-card__title truncate">{{ listing().title }}</h3>
        <div class="ui-listing-card__meta">
          <ng-content select="[card-meta]"></ng-content>
        </div>
        <div class="ui-listing-card__actions">
          <ng-content select="[card-actions]"></ng-content>
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
  listing = input.required<{
    id: string;
    slug: string;
    title: string;
    coverUrl?: string | null;
  }>();
}
