import { Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';
import { Card } from '../../../atoms/card/card';
import { FollowButton } from '../../../actions/follow-button/follow-button';
import { ShareButton } from '../../../actions/share-button/share-button';
import { ShareModalComponent } from '../../share-modal/share-modal';

@Component({
  selector: 'ui-business-card',
  imports: [
    CoverMedia,
    Card,
    RouterLink,
    BusinessIdentity,
    FollowButton,
    ShareButton,
    ShareModalComponent,
  ],
  templateUrl: './business-card.html',
  styleUrl: './business-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-business-card]': 'true',
  },
})
export class BusinessCard {
  business = input.required<{
    id: string;
    name: string;
    slug?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    isVerified?: boolean;
    isFollowed?: boolean;
    profileUrl?: any[] | string | null;
  }>();

  coverUrl = input<string | null | undefined>(null);
  showFollow = input<boolean>(true);
  showShare = input<boolean>(true);

  followToggle = output<boolean>();

  readonly showShareModal = signal(false);

  getLink(): any[] {
    return ['/b', this.business().slug || this.business().id];
  }
}
