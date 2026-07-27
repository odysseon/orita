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
  templateUrl: './listing-search-result.html',
  styleUrl: './listing-search-result.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-listing-search-result-host]': 'true',
  },
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

  /** `true` = user wants to save; `false` = user wants to unsave */
  saveToggle = output<boolean>();

  getListingLink(): any[] | null {
    const slug = this.listing().slug || this.listing().id;
    return slug ? ['/l', slug] : null;
  }
}
