import { Component, input, output } from '@angular/core';
import { ConversationContext } from '../../../molecules/messaging/conversation-context/conversation-context';
import { MessageList } from '../message-list/message-list';
import { MessageComposer } from '../../../molecules/messaging/message-composer/message-composer';
import { ChatHeader } from '../../../molecules/messaging/chat-header/chat-header';
import {
  IConversation,
  IConversationPreview,
  IMessage,
  SendMessageDto,
} from '../../../../../core/services/messaging.types';
import { LucideMessageCircleMore } from '@lucide/angular';

@Component({
  selector: 'ui-conversation-view',
  imports: [
    ChatHeader,
    ConversationContext,
    MessageList,
    MessageComposer,
    LucideMessageCircleMore,
  ],
  templateUrl: './conversation-view.html',
  styleUrl: './conversation-view.css',
})
export class ConversationView {
  conversation = input<IConversation | IConversationPreview | null>(null);
  messages = input<IMessage[]>([]);
  viewerParticipantId = input<string | undefined>(undefined);

  send = output<SendMessageDto>();
  back = output<void>();
  retry = output<string>();
  discard = output<string>();

  onSend(dto: SendMessageDto): void {
    this.send.emit(dto);
  }
}
