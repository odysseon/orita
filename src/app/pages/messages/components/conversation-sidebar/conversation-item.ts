import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IConversationPreview } from '../../../../core/services/messaging.types';

@Component({
  selector: 'app-conversation-item',
  imports: [DatePipe],
  templateUrl: './conversation-item.html',
  styleUrl: './conversation-item.css'
})
export class ConversationItem {
  conversation = input.required<IConversationPreview>();
  isActive = input(false);
  select = output<string>();
}
