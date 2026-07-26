import { ShareIntent } from '../../types/share.types.js';

export interface EmbedReference {
  embedType: 'BUSINESS' | 'LISTING' | 'TOUR' | 'LOCATION';
  targetId: string;
}

export function mapIntentToEmbed(intent: ShareIntent): EmbedReference {
  switch (intent.kind) {
    case 'listing':
      return { embedType: 'LISTING', targetId: intent.listingId };
    case 'business':
      return { embedType: 'BUSINESS', targetId: intent.businessId };
    case 'tour':
      return { embedType: 'TOUR', targetId: intent.tourId };
    default:
      // Typescript catch-all if more intents are added without updating mapper
      throw new Error(`Unsupported intent kind: ${(intent as any).kind}`);
  }
}
