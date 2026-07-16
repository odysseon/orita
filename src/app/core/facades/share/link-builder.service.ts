import { Service } from '@angular/core';
import { ShareIntent } from '../../types/share.types.js';

@Service()
export class LinkBuilderService {
  buildLink(intent: ShareIntent): string {
    const origin = window.location.origin;
    switch (intent.kind) {
      case 'business':
        return `${origin}/b/${intent.businessSlug}`;
      case 'listing':
        return `${origin}/l/${intent.listingSlug}`;
      case 'tour':
        return `${origin}/t/${intent.tourId}`;
      default:
        // Fallback for unexpected intents
        return origin;
    }
  }
}
