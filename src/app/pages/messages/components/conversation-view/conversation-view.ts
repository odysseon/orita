import { Component, input, output } from '@angular/core';
import { ChatHeader } from './chat-header/chat-header';
import { ConversationContext } from './conversation-context/conversation-context';
import { MessageList } from './message-list/message-list';
import { MessageComposer } from './message-composer/message-composer';
import { IConversation, IConversationPreview, IMessage, SendMessageDto } from '../../../../core/services/messaging.types';

@Component({
  selector: 'app-conversation-view',
  imports: [ChatHeader, ConversationContext, MessageList, MessageComposer],
  templateUrl: './conversation-view.html',
  styleUrl: './conversation-view.css'
})
export class ConversationView {
  conversation = input<IConversation | IConversationPreview | null>(null);
  messages = input<IMessage[]>([]);
  currentUserName = input<string>('You');
  
  send = output<SendMessageDto>();
  back = output<void>();

  onSend(dto: SendMessageDto): void {
    this.send.emit(dto);
  }
}
