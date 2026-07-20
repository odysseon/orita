import { Service, inject, OnDestroy } from '@angular/core';
import { MessagingApiService } from './messaging-api.service';
import { MessagingSocket } from './messaging-socket.service';
import { MessageStore } from './message-store.service';
import { OutgoingMessageQueue } from './outgoing-message-queue.service';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { Subscription, firstValueFrom, timer } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { IMessage, SendMessageDto, CreateConversationDto, IConversationPreview } from './messaging.types';

@Service()
export class MessagingRepository implements OnDestroy {
  #api = inject(MessagingApiService);
  #socket = inject(MessagingSocket);
  #store = inject(MessageStore);
  #queue = inject(OutgoingMessageQueue);
  #db = inject(DatabaseService);
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

        const activeId = this.#store.activeConversationId();
        const currentUserId = this.#auth.currentUser()?.id;

        if (activeId === event.conversationId && event.message.participantId !== currentUserId) {
          this.#socket.markRead(activeId, [event.message.id]);
          this.#store.markConversationRead(activeId);
        }
      })
    );

    this.#subs.add(
      this.#socket.messageRead$.subscribe(event => {
        this.#store.markMessagesRead(event.conversationId, [event.messageId], event.readAt);
      })
    );

    this.#subs.add(
      this.#socket.connected$.subscribe(() => {
        this.#queue.load().then(() => {
          this._processQueue();
        });
      })
    );
  }

  async loadConversations(): Promise<void> {
    // 1. Instantly load from IndexedDB
    const cached = await this.#db.getConversationPreviews();
    if (cached.length > 0) {
      this.#store.setConversations(cached.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()));
    }

    // 2. Background fetch and merge
    this.#api.getConversations().subscribe(fresh => {
      this._mergeConversations(cached, fresh);
    });
  }

  private async _mergeConversations(cached: IConversationPreview[], fresh: IConversationPreview[]): Promise<void> {
    const mergedMap = new Map<string, IConversationPreview>();
    
    for (const c of cached) {
      mergedMap.set(c.id, c);
    }

    let modified = false;
    for (const f of fresh) {
      const existing = mergedMap.get(f.id);
      if (!existing || new Date(f.lastActivityAt).getTime() > new Date(existing.lastActivityAt).getTime()) {
        mergedMap.set(f.id, f);
        modified = true;
      }
    }

    if (modified || cached.length !== fresh.length) {
      const mergedList = Array.from(mergedMap.values()).sort((a, b) => 
        new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );
      this.#store.setConversations(mergedList);
      await this.#db.saveConversationPreviews(mergedList);
    }
  }

  async loadConversation(id: string): Promise<void> {
    this.#store.setActiveConversationId(id);
    this.#socket.joinConversation(id);
    this.#store.setConversationStatus(id, 'loading');

    // 1. Instantly load messages from IndexedDB
    const cachedMessages = await this.#db.getMessagesForConversation(id);
    if (cachedMessages.length > 0) {
      const mergedLocal = this._mergePendingMessages(id, cachedMessages);
      this.#store.setMessages(id, mergedLocal);
    }

    this.#api.getConversationDetails(id).subscribe({
      next: async (conversation) => {
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
        
        // Persist fresh server messages individually to IDB
        if (serverMessages.length > 0) {
          await this.#db.saveMessages(serverMessages);
        }

        // We can just query IDB again to get the complete merged sorted history, 
        // or just use serverMessages if it represents the latest page. 
        // For now, we will query IDB to get the full unified list:
        const fullHistory = await this.#db.getMessagesForConversation(id);
        const unifiedHistory = fullHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const mergedMessages = this._mergePendingMessages(id, unifiedHistory);
        this.#store.setMessages(id, mergedMessages);
        this.#store.setConversationStatus(id, 'loaded');

        // Fix: unread messages badge drifting
        // Mark unread messages sent by others as read
        const viewerId = conversation.viewer?.participantId;
        if (viewerId) {
          const unreadIds = unifiedHistory
            .filter(m => m.participantId !== viewerId && !m.readReceipts?.some(r => r.participantId === viewerId))
            .map(m => m.id);
          if (unreadIds.length > 0) {
            this.#socket.markRead(id, unreadIds);
            
            // P1B: Optimistically mutate and persist unread counts to IDB
            this.#store.markConversationRead(id);
            this.#store.conversations().find(c => c.id === id && (async () => {
              c.unreadCount = 0;
              await this.#db.saveConversationPreview(c);
            })());
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
    this.#api.createConversation(dto).subscribe(conversation => {
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
      const serverMessage = await firstValueFrom(
        this.#api.sendMessage(conversationId, dto).pipe(
          timeout(30000)
        )
      );

      this.#queue.remove(tempId);

      this.#store.messages.update(map => {
        const list = map[conversationId] || [];
        return {
          ...map,
          [conversationId]: list.map(m => m.id === tempId ? serverMessage : m)
        };
      });
    } catch (err: any) {
      const pending = this.#queue.getAll().find(m => m.id === tempId);
      if (pending && pending.attemptCount < 3) {
        this.#queue.updateStatus(tempId, 'LOCAL', err?.message || 'Network error');
        // Exponential backoff
        const backoffMs = Math.pow(2, pending.attemptCount) * 1000;
        setTimeout(() => {
          this._trySendMessage(conversationId, tempId, dto, currentUserId);
        }, backoffMs);
      } else {
        this.#queue.updateStatus(tempId, 'FAILED', err?.message || 'Network error');
      }
      
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
