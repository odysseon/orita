import { Component, input } from '@angular/core';
import { IConversationAnchor } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-conversation-context',
  templateUrl: './conversation-context.html',
  styleUrl: './conversation-context.css'
})
export class ConversationContext {
  anchor = input<IConversationAnchor | null>(null);

  getContextType(): string {
    const a = this.anchor();
    if (!a) return '';
    if (a.listingId) return 'Listing';
    if (a.tourId) return 'Tour';
    if (a.businessId) return 'Business';
    if (a.locationId) return 'Location';
    return 'Context';
  }
}
