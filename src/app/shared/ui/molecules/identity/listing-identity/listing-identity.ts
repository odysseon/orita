import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ui-listing-identity',
  standalone: true,
  imports: [CoverMedia, CurrencyPipe, Card],
  template: `
    <app-card padding="none" appearance="plain" style="display: flex; align-items: center; gap: var(--size-12);">
      <div class="ui-listing-identity-thumbnail" [class]="'size-' + size()">
        <ui-cover-media
          [src]="listing().imageUrl || null"
          [alt]="listing().title"
        ></ui-cover-media>
      </div>
      <div class="ui-listing-identity-info">
        <div class="ui-listing-identity-title">{{ listing().title }}</div>
        @if (showPrice() && listing().price) {
          <div class="ui-listing-identity-price">{{ listing().price | currency:'NGN':'symbol-narrow':'1.0-0' }}</div>
        }
        @if (metadata()) {
          <div class="ui-listing-identity-metadata">{{ metadata() }}</div>
        }
      </div>
    </app-card>
  `,
  styleUrl: './listing-identity.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()'
  }
})
export class ListingIdentity {
  listing = input.required<{
    id: string;
    title: string;
    imageUrl?: string | null;
    price?: string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showPrice = input<boolean>(true);
  metadata = input<string | null>(null);

  classes = computed(() => {
    return `ui-listing-identity ui-listing-identity--${this.size()}`;
  });
}
