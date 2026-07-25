import { Component, input, output } from '@angular/core';
import { LucideChevronLeft, LucideMoreVertical } from '@lucide/angular';
import { IConversation, IConversationPreview } from '../../../../../core/services/messaging.types';

import { Button } from '../../../atoms/button/button';
import { Avatar } from '../../../identity/avatar/avatar';


@Component({
  selector: 'ui-chat-header',
  imports: [LucideChevronLeft, LucideMoreVertical, Button, Avatar],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.css'
})
export class ChatHeader {
  conversation = input<IConversation | IConversationPreview | null>(null);
  back = output<void>();
}
