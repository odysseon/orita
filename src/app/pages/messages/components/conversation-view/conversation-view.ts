import { Component, input, output } from '@angular/core';
import { ConversationContext } from './conversation-context/conversation-context';
import { MessageList } from './message-list/message-list';
import { MessageComposer } from './message-composer/message-composer';
import { IConversation, IConversationPreview, IMessage, SendMessageDto } from '../../../../core/services/messaging.types';
import { AppHeader } from '../../../../shared/app-header/app-header';
import { LucideArrowLeft, LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-conversation-view',
  imports: [AppHeader, ConversationContext, MessageList, MessageComposer, LucideArrowLeft, LucideUser],
  templateUrl: './conversation-view.html',
  styleUrl: './conversation-view.css'
})
export class ConversationView {
  conversation = input<IConversation | IConversationPreview | null>(null);
  messages = input<IMessage[]>([]);
  viewerParticipantId = input<string | undefined>(undefined);
  
  send = output<SendMessageDto>();
  back = output<void>();

  onSend(dto: SendMessageDto): void {
    this.send.emit(dto);
  }
}
