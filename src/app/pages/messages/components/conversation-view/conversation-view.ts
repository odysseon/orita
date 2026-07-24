import { Component, input, output } from '@angular/core';
import { ConversationContext } from './conversation-context/conversation-context';
import { MessageList } from './message-list/message-list';
import { MessageComposer } from './message-composer/message-composer';
import {
  IConversation,
  IConversationPreview,
  IMessage,
  SendMessageDto,
} from '../../../../core/services/messaging.types';
import { PageHeader } from '../../../../shared/ui/organisms/page-header/page-header';
import { LucideArrowLeft, LucideMessageCircleMore, LucideUser } from '@lucide/angular';

import { Button } from '../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-conversation-view',
  imports: [
    PageHeader,
    ConversationContext,
    MessageList,
    MessageComposer,
    LucideMessageCircleMore,
    LucideArrowLeft,
    LucideUser,
    Button,
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
