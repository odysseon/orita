import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListItem } from '../../../surfaces/list/list';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { SaveButton } from '../../../actions/save-button/save-button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ui-listing-search-result',
  standalone: true,
  imports: [RouterLink, ListItem, CoverMedia, SaveButton, CurrencyPipe],
  template: `
    <a uiListItem [routerLink]="getListingLink()" class="ui-listing-search-result-row">
      @if (!hideThumbnail()) {
        <div class="ui-listing-search-result__start">
          <ng-content select="[result-leading-action]"></ng-content>
          @if (listing().thumbnailUrl) {
            <div class="ui-listing-search-result__thumbnail">
              <ui-cover-media 
                [src]="listing().thumbnailUrl || null" 
                aspectRatio="square"
                fallbackIcon="package"
              ></ui-cover-media>
            </div>
          }
        </div>
      }
      
      <div class="ui-listing-search-result__content">
        <div class="ui-listing-search-result__title truncate">{{ listing().title }}</div>
        @if (listing().price !== undefined) {
          <div class="ui-listing-search-result__description truncate">
            <span class="ui-listing-search-result__price">{{ listing().price! | currency:'NGN':'symbol-narrow':'1.0-0' }}</span>
            @if (listing().availability === 'in-stock') {
              <span class="ui-listing-search-result__status is-available">In Stock</span>
            } @else if (listing().availability === 'out-of-stock') {
              <span class="ui-listing-search-result__status is-unavailable">Out of Stock</span>
            }
          </div>
        }
      </div>

      <div class="ui-listing-search-result__end" (click)="$event.stopPropagation()">
        <ng-content select="[result-action]"></ng-content>
        @if (showSave()) {
          <ui-save-button [isSaved]="listing().isSaved ?? false" appearance="solid" size="sm" (toggle)="saveToggle.emit(listing())"></ui-save-button>
        }
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
    slug?: string | null;
    thumbnailUrl?: string | null;
    price?: number;
    availability?: 'in-stock' | 'out-of-stock' | 'pre-order';
    isSaved?: boolean;
  }>();

  hideThumbnail = input<boolean>(false);
  showSave = input<boolean>(true);

  saveToggle = output<any>();

  getListingLink(): any[] | null {
    const slug = this.listing().slug || this.listing().id;
    return slug ? ['/l', slug] : null;
  }
}
