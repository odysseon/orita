import { Component, inject, OnInit, signal, PLATFORM_ID, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RootHeader } from '../../shared/ui/organisms/root-header/root-header';
import { ConversationSidebar } from '../../shared/ui/organisms/messaging/conversation-sidebar/conversation-sidebar';
import { ConversationView } from '../../shared/ui/organisms/messaging/conversation-view/conversation-view';
import { MessagingRepository } from '../../core/services/messaging-repository.service';
import { SendMessageCommand } from '../../core/services/messaging.types';
import { AuthService } from '../../core/services/auth.service';
import { DraftMessageService } from '../../core/services/draft-message.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationsPage } from '../notifications/notifications';
import { LucideTriangleAlert } from '@lucide/angular';
import { Button } from '../../shared/ui/atoms/button/button';
import { Badge } from '../../shared/ui/atoms/badge/badge';

import { Tabs, TabList, TabTrigger } from '../../shared/ui/molecules/tabs';

@Component({
  selector: 'app-messages',
  imports: [RootHeader, ConversationSidebar, ConversationView, NotificationsPage, LucideTriangleAlert, Button, Badge, Tabs, TabList, TabTrigger],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class MessagesPage implements OnInit {
  messaging = inject(MessagingRepository);
  notificationService = inject(NotificationService);
  #auth = inject(AuthService);
  #draftStore = inject(DraftMessageService);
  #route = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  activeTab: 'inbox' | 'updates' = 'inbox';

  readonly isDesktop = signal<boolean>(false);
  #platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      const mediaQuery = window.matchMedia('(min-width: 48rem)');
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
    this.#route.paramMap.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.messaging.loadConversation(id);
      }
    });
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
