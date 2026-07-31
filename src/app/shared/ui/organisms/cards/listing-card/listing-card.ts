import { Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';
import { ShareButton } from '../../../actions/share-button/share-button';
import { ShareModalComponent } from '../../share-modal/share-modal';
import { MessageButton } from '../../../actions/message-button/message-button';
import { SaveButton } from '../../../actions/save-button/save-button';
import { ListingMeta } from '../../../molecules/listing-meta/listing-meta';

@Component({
  selector: 'ui-listing-card',
  standalone: true,
  imports: [
    CoverMedia,
    Card,
    ShareButton,
    ShareModalComponent,
    MessageButton,
    RouterLink,
    SaveButton,
    ListingMeta,
  ],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-listing-card]': 'true',
  },
})
export class ListingCard {
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
    };
  }>();

  showSave = input<boolean>(true);
  showShare = input<boolean>(true);
  showMessage = input<boolean>(true);

  saveToggle = output<boolean>();

  readonly showShareModal = signal(false);

  getLink(): any[] {
    return ['/l', this.listing().slug || this.listing().id];
  }
}
