import { Service, inject, OnDestroy } from '@angular/core';
import { MessagingRepository } from './messaging-repository.service';
import { MessagingSocket } from './messaging-socket.service';
import { MessageStore } from './message-store.service';
import { OutgoingMessageQueue, OutgoingMessage } from './outgoing-message-queue.service';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { IMessage, SendMessageDto, CreateConversationDto } from './messaging.types';

@Service()
export class MessagingService implements OnDestroy {
  #repo = inject(MessagingRepository);
  #socket = inject(MessagingSocket);
  #store = inject(MessageStore);
  #queue = inject(OutgoingMessageQueue);
  #auth = inject(AuthService);
  
  #subs = new Subscription();

  readonly conversations = this.#store.conversations;
  readonly activeConversation = this.#store.activeConversation;
  readonly activeMessages = this.#store.activeMessages;
  readonly conversationStatus = this.#store.conversationStatus;
  readonly conversationError = this.#store.conversationError;

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

    this.#subs.add(
      this.#socket.connected$.subscribe(() => {
        this._processQueue();
      })
    );
  }

  loadConversations(): void {
    this.#repo.getConversations().subscribe(conversations => {
      this.#store.setConversations(conversations);
    });
  }

  loadConversation(id: string): void {
    this.#store.setActiveConversationId(id);
    this.#socket.joinConversation(id);
    this.#store.setConversationStatus(id, 'loading');

    this.#repo.getConversationDetails(id).subscribe({
      next: (conversation) => {
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

        // Merge server messages with pending messages from the queue
        const serverMessages = conversation.messages || [];
        const mergedMessages = this._mergePendingMessages(id, serverMessages);
        this.#store.setMessages(id, mergedMessages);
        this.#store.setConversationStatus(id, 'loaded');

        // Fix: unread messages badge drifting
        // Mark unread messages sent by others as read
        const viewerId = conversation.viewer?.participantId;
        if (viewerId) {
          const unreadIds = serverMessages
            .filter(m => m.participantId !== viewerId && !m.readReceipts?.some(r => r.participantId === viewerId))
            .map(m => m.id);
          if (unreadIds.length > 0) {
            this.#socket.markRead(id, unreadIds);
          }
        }
      },
      error: (err) => {
        this.#store.setConversationStatus(id, 'error', err);
        console.error(`Failed to load conversation ${id}`, err);
      }
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

  async sendMessage(conversationId: string, dto: SendMessageDto): Promise<void> {
    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    const tempId = `temp-${Date.now()}`;
    
    // 1. Queue locally
    this.#queue.enqueue(conversationId, tempId, dto);
    
    // Merge immediately so it shows up in UI
    const merged = this._mergePendingMessages(conversationId, this.#store.messages()[conversationId] || []);
    this.#store.setMessages(conversationId, merged);

    await this._trySendMessage(conversationId, tempId, dto, currentUserId);
  }

  retryMessage(conversationId: string, messageId: string): void {
    const pending = this.#queue.getAll().find(m => m.id === messageId);
    if (!pending) return;

    this.#queue.updateStatus(messageId, 'SENDING');
    const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
    this.#store.setMessages(conversationId, merged);

    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    this._trySendMessage(conversationId, messageId, pending.payload, currentUserId);
  }

  discardMessage(conversationId: string, messageId: string): void {
    this.#queue.remove(messageId);
    const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
    this.#store.setMessages(conversationId, merged);
  }

  private async _trySendMessage(conversationId: string, tempId: string, dto: SendMessageDto, currentUserId: string): Promise<void> {
    this.#queue.updateStatus(tempId, 'SENDING');
    
    try {
      const serverMessage = await new Promise<IMessage>((resolve, reject) => {
        this.#repo.sendMessage(conversationId, dto).subscribe({
          next: resolve,
          error: reject
        });
      });

      this.#queue.remove(tempId);

      this.#store.messages.update(map => {
        const list = map[conversationId] || [];
        return {
          ...map,
          [conversationId]: list.map(m => m.id === tempId ? serverMessage : m)
        };
      });
    } catch (err: any) {
      this.#queue.updateStatus(tempId, 'FAILED', err?.message || 'Network error');
      const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
      this.#store.setMessages(conversationId, merged);
    }
  }

  private _getServerMessages(conversationId: string): IMessage[] {
    const current = this.#store.messages()[conversationId] || [];
    return current.filter(m => m.syncState !== 'LOCAL' && m.syncState !== 'SENDING' && m.syncState !== 'FAILED');
  }

  private _processQueue(): void {
    const all = this.#queue.getAll();
    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    
    for (const msg of all) {
      if (msg.status === 'LOCAL' || msg.status === 'FAILED') {
        this._trySendMessage(msg.conversationId, msg.id, msg.payload, currentUserId);
      }
    }
  }

  private _mergePendingMessages(conversationId: string, serverMessages: IMessage[]): IMessage[] {
    const pending = this.#queue.getForConversation(conversationId);
    if (!pending.length) return serverMessages;

    const currentUserId = this.#auth.currentUser()?.id || 'unknown';

    const localMessages: IMessage[] = pending.map(p => ({
      id: p.id,
      conversationId: p.conversationId,
      participantId: currentUserId,
      senderDisplayName: 'You',
      content: p.payload.content,
      mediaUrl: p.payload.mediaUrl,
      mediaType: p.payload.mediaType,
      embeds: p.payload.embeds ? p.payload.embeds.map((e, i) => ({
        id: `${p.id}-embed-${i}`,
        embedType: e.embedType,
        targetId: e.targetId,
        title: 'Shared Item'
      })) : [],
      createdAt: new Date(p.createdAt).toISOString(),
      readReceipts: [],
      syncState: p.status
    }));

    return [...serverMessages, ...localMessages];
  }

  ngOnDestroy(): void {
    this.#subs.unsubscribe();
    this.#socket.disconnect();
  }
}
