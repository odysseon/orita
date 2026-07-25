import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverMedia } from '../../surfaces/cover-media/cover-media';
import { Card } from '../../atoms/card/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ui-listing-identity',
  standalone: true,
  imports: [CoverMedia, CurrencyPipe, Card, RouterLink],
  template: `
    @if (interactive() && activeLink()) {
      <a [routerLink]="activeLink()" (click)="$event.stopPropagation()" class="ui-identity-link">
        <app-card padding="none" appearance="plain" style="display: flex; align-items: center; gap: var(--size-12); width: 100%;">
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
      </a>
    } @else {
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
    }
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
    slug?: string | null;
    imageUrl?: string | null;
    price?: string | null;
    profileUrl?: any[] | string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showPrice = input<boolean>(true);
  metadata = input<string | null>(null);
  interactive = input<boolean>(true);
  link = input<any[] | string | null>(null);

  activeLink = computed(() => {
    const l = this.link();
    if (l !== null && l !== undefined) return l;
    const item = this.listing() as any;
    if (item?.profileUrl) return item.profileUrl;
    if (item?.slug) return ['/l', item.slug];
    return null;
  });

  classes = computed(() => {
    return `ui-listing-identity ui-listing-identity--${this.size()}`;
  });
}

