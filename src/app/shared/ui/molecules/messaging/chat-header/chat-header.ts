import { Component, input, output, computed } from '@angular/core';
import { LucideMoreVertical } from '@lucide/angular';
import { IConversation, IConversationPreview } from '../../../../../core/services/messaging.types';

import { Button } from 'ur-ui';
import { PageHeader } from '../../../organisms/page-header/page-header';
import { UserIdentity } from '../../../identity/user-identity/user-identity';
import { AvatarStatus } from 'ur-ui';

@Component({
  selector: 'ui-chat-header',
  imports: [LucideMoreVertical, Button, PageHeader, UserIdentity],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.css'
})
export class ChatHeader {
  conversation = input<IConversation | IConversationPreview | null>(null);
  back = output<void>();

  headerUser = computed(() => {
    const conv = this.conversation() as any;
    return {
      id: conv?.id || 'default',
      displayName: conv?.title || conv?.participants?.[0]?.displayName || 'User',
      username: conv?.participants?.[0]?.username || '',
      avatarUrl: conv?.avatarUrl || conv?.participants?.[0]?.avatarUrl || null,
      status: (conv?.status || 'online') as AvatarStatus
    };
  });
}
