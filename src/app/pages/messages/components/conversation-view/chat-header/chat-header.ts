import { Component, input, output } from '@angular/core';
import { LucideChevronLeft, LucideMoreVertical } from '@lucide/angular';
import { IConversation } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-chat-header',
  imports: [LucideChevronLeft, LucideMoreVertical],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.css'
})
export class ChatHeader {
  conversation = input<IConversation | null>(null);
  back = output<void>();
}
