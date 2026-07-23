import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppHeader } from '../../shared/app-header/app-header';
import { ConversationSidebar } from './components/conversation-sidebar/conversation-sidebar';
import { ConversationView } from './components/conversation-view/conversation-view';
import { MessagingRepository } from '../../core/services/messaging-repository.service';
import { SendMessageCommand } from '../../core/services/messaging.types';
import { AuthService } from '../../core/services/auth.service';
import { DraftMessageService } from '../../core/services/draft-message.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationsPage } from '../notifications/notifications';
import { LucideTriangleAlert } from '@lucide/angular';
import { Button } from '../../shared/ui/atoms/button/button';
import { Badge } from '../../shared/ui/atoms/badge/badge';

@Component({
  selector: 'app-messages',
  imports: [AppHeader, ConversationSidebar, ConversationView, NotificationsPage, LucideTriangleAlert, Button, Badge],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class MessagesPage implements OnInit {
  messaging = inject(MessagingRepository);
  notificationService = inject(NotificationService);
  #auth = inject(AuthService);
  #draftStore = inject(DraftMessageService);

  activeTab: 'inbox' | 'updates' = 'inbox';

  readonly isDesktop = signal<boolean>(false);
  #platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      this.isDesktop.set(mediaQuery.matches);

      mediaQuery.addEventListener('change', (e) => {
        this.isDesktop.set(e.matches);
      });
    }
  }

  get activeConversationId(): () => string | null {
    return this.messaging.activeConversation() ? () => this.messaging.activeConversation()!.id : () => null;
  }

  get viewerParticipantId(): () => string | undefined {
    return this.messaging.activeConversation() ? () => (this.messaging.activeConversation() as any)!.viewer?.participantId : () => undefined;
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

  async onSendMessage(command: SendMessageCommand): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    
    // In real app, currentUserId is retrieved from Auth or User profile
    const userId = 'self';
    
    try {
      await this.messaging.sendMessage(id, command);
      // Clear drafts on success
      this.#draftStore.clearDraft(id);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }

  onRetry(messageId: string): void {
    const id = this.activeConversationId();
    if (id) {
      this.messaging.retryMessage(id, messageId);
    }
  }

  onDiscard(messageId: string): void {
    const id = this.activeConversationId();
    if (id) {
      this.messaging.discardMessage(id, messageId);
    }
  }
}
