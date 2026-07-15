import { Component, inject, OnInit } from '@angular/core';
import { AppHeader } from '../../shared/app-header/app-header';
import { ConversationSidebar } from './components/conversation-sidebar/conversation-sidebar';
import { ConversationView } from './components/conversation-view/conversation-view';
import { MessagingService } from '../../core/services/messaging.service';
import { SendMessageDto } from '../../core/services/messaging.types';
import { AuthService } from '../../core/services/auth.service';
import { DraftMessageService } from '../../core/services/draft-message.service';

@Component({
  selector: 'app-messages',
  imports: [AppHeader, ConversationSidebar, ConversationView],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class MessagesPage implements OnInit {
  messaging = inject(MessagingService);
  #auth = inject(AuthService);
  #draftStore = inject(DraftMessageService);

  get activeConversationId(): () => string | null {
    return this.messaging.activeConversation() ? () => this.messaging.activeConversation()!.id : () => null;
  }

  get currentUserName(): string {
    // In a real app, you would retrieve the current user's profile
    return 'You';
  }

  ngOnInit(): void {
    this.messaging.loadConversations();
  }

  onSelectConversation(id: string): void {
    this.messaging.loadConversation(id);
  }

  onBackToSidebar(): void {
    // Clear active conversation to go back to list on mobile
    this.messaging.clearActiveConversation();
  }

  async onSendMessage(dto: SendMessageDto): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    
    // In real app, currentUserId is retrieved from Auth or User profile
    const userId = 'self';
    
    try {
      await this.messaging.sendMessage(id, dto, userId);
      // Clear drafts on success
      this.#draftStore.clearDraft(id);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }
}
