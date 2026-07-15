import { Service, inject, OnDestroy } from '@angular/core';
import { MessagingRepository } from './messaging-repository.service';
import { MessagingSocket } from './messaging-socket.service';
import { MessageStore } from './message-store.service';
import { Subscription } from 'rxjs';
import { IMessage, SendMessageDto, CreateConversationDto } from './messaging.types';

@Service()
export class MessagingService implements OnDestroy {
  #repo = inject(MessagingRepository);
  #socket = inject(MessagingSocket);
  #store = inject(MessageStore);
  
  #subs = new Subscription();

  // Expose store signals as read-only to components
  readonly conversations = this.#store.conversations;
  readonly activeConversation = this.#store.activeConversation;
  readonly activeMessages = this.#store.activeMessages;

  constructor() {
    this.#socket.connect();

    this.#subs.add(
      this.#socket.messageNew$.subscribe(event => {
        this.#store.addMessage(event.message);
      })
    );

    this.#subs.add(
      this.#socket.messageRead$.subscribe(event => {
        this.#store.markMessagesRead(event.conversationId, [event.messageId], event.readAt);
      })
    );
  }

  loadConversations(): void {
    this.#repo.getConversations().subscribe(conversations => {
      this.#store.setConversations(conversations);
      // For MVP, we extract latestMessage manually if the backend didn't do it, but let's assume it's there
    });
  }

  loadConversation(id: string): void {
    this.#store.setActiveConversationId(id);
    this.#socket.joinConversation(id);

    this.#repo.getConversationDetails(id).subscribe(conversation => {
      // Update this conversation in the list safely without overwriting the preview's computed title/avatar
      this.#store.conversations.update(list => {
        const idx = list.findIndex(c => c.id === id);
        const existing = idx !== -1 ? list[idx] : null;

        const preview = {
          id: conversation.id,
          type: conversation.type,
          title: existing?.title || conversation.title || 'Conversation',
          avatarUrl: existing?.avatarUrl || null,
          unreadCount: existing?.unreadCount ?? (conversation.unreadCount || 0),
          lastActivityAt: existing?.lastActivityAt ?? conversation.updatedAt
        };

        if (idx === -1) return [...list, preview];
        const copy = [...list];
        copy[idx] = { ...copy[idx], ...preview };
        return copy;
      });

      this.#store.setActiveConversationDetails(conversation);

      // Set the messages array
      this.#store.setMessages(id, conversation.messages || []);
    });
  }

  clearActiveConversation(): void {
    this.#store.setActiveConversationId(null);
  }

  createConversation(dto: CreateConversationDto): void {
    this.#repo.createConversation(dto).subscribe(conversation => {
      const preview = {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title || 'Conversation',
        avatarUrl: null,
        unreadCount: conversation.unreadCount || 0,
        lastActivityAt: conversation.updatedAt
      };
      this.#store.conversations.update(list => [preview, ...list]);
      this.loadConversation(conversation.id);
    });
  }

  sendMessage(conversationId: string, dto: SendMessageDto, currentUserId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 1. Optimistic Update
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: IMessage = {
        id: tempId,
        conversationId,
        participantId: currentUserId, // Normally we'd use the participant ID, but close enough for UI
        senderDisplayName: 'You',
        content: dto.content,
        mediaUrl: dto.mediaUrl,
        mediaType: dto.mediaType,
        embeds: dto.embeds ? dto.embeds.map((e, i) => ({
          id: `temp-embed-${Date.now()}-${i}`,
          embedType: e.embedType,
          targetId: e.targetId,
          title: 'Shared Item'
        })) : [],
        createdAt: new Date().toISOString(),
        readReceipts: [],
        isOptimistic: true
      };

      this.#store.addMessage(optimisticMessage);

      // 2. Send via REST for reliable ACK.
      this.#repo.sendMessage(conversationId, dto).subscribe({
        next: (serverMessage) => {
          // Replace temp message with server message
          this.#store.messages.update(map => {
            const list = map[conversationId] || [];
            return {
              ...map,
              [conversationId]: list.map(m => m.id === tempId ? serverMessage : m)
            };
          });
          resolve();
        },
        error: (err) => {
          // Mark as failed
          this.#store.messages.update(map => {
            const list = map[conversationId] || [];
            return {
              ...map,
              [conversationId]: list.map(m => m.id === tempId ? { ...m, isOptimistic: false, isFailed: true } : m)
            };
          });
          reject(err);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.#subs.unsubscribe();
    this.#socket.disconnect();
  }
}
