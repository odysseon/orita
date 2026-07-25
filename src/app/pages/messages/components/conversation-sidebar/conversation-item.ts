import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IConversationPreview } from '../../../../core/services/messaging.types';
import { MessagePreviewPipe } from '../../../../shared/pipes/message-preview.pipe';
import { LucideMapPin, LucideShoppingBag, LucideMap, LucideFootprints, LucideVideo, LucideImage } from '@lucide/angular';
import { Avatar } from '../../../../shared/ui/identity/avatar/avatar';


@Component({
  selector: 'app-conversation-item',
  imports: [DatePipe, MessagePreviewPipe, LucideMapPin, LucideShoppingBag, LucideMap, LucideFootprints, LucideVideo, LucideImage, Avatar],
  templateUrl: './conversation-item.html',
  styleUrl: './conversation-item.css'
})
export class ConversationItem {
  conversation = input.required<IConversationPreview>();
  isActive = input(false);
  select = output<string>();
}
