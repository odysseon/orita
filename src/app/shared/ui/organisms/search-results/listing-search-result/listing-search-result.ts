import { Component, input, ViewEncapsulation } from '@angular/core';
import { ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd } from '../../../surfaces/list/list';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ui-listing-search-result',
  standalone: true,
  imports: [ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd, CoverMedia, CurrencyPipe],
  template: `
    <a uiListItem class="ui-listing-search-result">
      <div uiListItemStart class="ui-listing-search-result__start">
        <ng-content select="[result-leading-action]"></ng-content>
        <div class="ui-listing-search-result__thumbnail">
          <ui-cover-media 
            [src]="listing().thumbnailUrl || null" 
            aspectRatio="square"
            fallbackIcon="package"
          ></ui-cover-media>
        </div>
      </div>
      
      <div uiListItemContent>
        <div uiListItemTitle class="truncate">{{ listing().title }}</div>
        <div uiListItemDescription class="truncate">
          <span class="ui-listing-search-result__price">{{ listing().price | currency:'NGN':'symbol-narrow':'1.0-0' }}</span>
          @if (listing().availability === 'in-stock') {
            <span class="ui-listing-search-result__status is-available">In Stock</span>
          } @else if (listing().availability === 'out-of-stock') {
            <span class="ui-listing-search-result__status is-unavailable">Out of Stock</span>
          }
        </div>
      </div>

      <div uiListItemEnd class="ui-listing-search-result__end">
        <ng-content select="[result-action]"></ng-content>
      </div>
    </a>
  `,
  styleUrl: './listing-search-result.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-listing-search-result-host]': 'true'
  }
})
export class ListingSearchResult {
  listing = input.required<{
    id: string;
    title: string;
    thumbnailUrl?: string | null;
    price: number;
    availability?: 'in-stock' | 'out-of-stock' | 'pre-order';
    isSaved?: boolean;
  }>();
}
