import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppHeader } from '../../shared/app-header/app-header';
import { ConversationSidebar } from './components/conversation-sidebar/conversation-sidebar';
import { ConversationView } from './components/conversation-view/conversation-view';
import { MessagingService } from '../../core/services/messaging.service';
import { SendMessageDto } from '../../core/services/messaging.types';
import { AuthService } from '../../core/services/auth.service';
import { DraftMessageService } from '../../core/services/draft-message.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'app-messages',
  imports: [AppHeader, ConversationSidebar, ConversationView, NotificationsPage],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class MessagesPage implements OnInit {
  messaging = inject(MessagingService);
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
