import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListItem } from '../../../surfaces/list/list';
import { Avatar } from '../../../identity/avatar/avatar';
import { SaveButton } from '../../../actions/save-button/save-button';
import { CurrencyPipe } from '@angular/common';
import { resolveEmbedRoute } from '../../../../utils/embed.utils';

@Component({
  selector: 'ui-listing-search-result',
  imports: [RouterLink, ListItem, Avatar, SaveButton, CurrencyPipe],
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
    availability?: string;
    isSaved?: boolean;
  }>();

  embedType = input<string>('LISTING');

  hideThumbnail = input<boolean>(false);
  showSave = input<boolean>(true);

  /** `true` = user wants to save; `false` = user wants to unsave */
  saveToggle = output<boolean>();

  getListingLink(): any[] | null {
    return resolveEmbedRoute({
      embedType: this.embedType(),
      targetId: this.listing().id,
      slug: this.listing().slug
    });
  }
}
