import { Service, inject, OnDestroy } from '@angular/core';
import { MessagingApiService } from './messaging-api.service';
import { MessagingSocket } from './messaging-socket.service';
import { MessageStore } from './message-store.service';
import { OutgoingMessageQueue } from './outgoing-message-queue.service';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { MediaService } from './media.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { IMessage, SendMessageDto, CreateConversationDto, IConversationPreview, SendMessageCommand, PendingAttachment, QueuedAttachment } from './messaging.types';

@Service()
export class MessagingRepository implements OnDestroy {
  #api = inject(MessagingApiService);
  #socket = inject(MessagingSocket);
  #store = inject(MessageStore);
  #queue = inject(OutgoingMessageQueue);
  #db = inject(DatabaseService);
  #auth = inject(AuthService);
  #media = inject(MediaService);
  
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
    const cached = await this.#db.getConversationPreviews();
    if (cached.length > 0) {
      this.#store.setConversations(cached.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()));
    }

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

        const serverMessages = conversation.messages || [];
        
        if (serverMessages.length > 0) {
          await this.#db.saveMessages(serverMessages);
        }

        const fullHistory = await this.#db.getMessagesForConversation(id);
        const unifiedHistory = fullHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const mergedMessages = this._mergePendingMessages(id, unifiedHistory);
        this.#store.setMessages(id, mergedMessages);
        this.#store.setConversationStatus(id, 'loaded');

        const viewerId = conversation.viewer?.participantId;
        if (viewerId) {
          const unreadIds = unifiedHistory
            .filter(m => m.participantId !== viewerId && !m.readReceipts?.some(r => r.participantId === viewerId))
            .map(m => m.id);
          if (unreadIds.length > 0) {
            this.#socket.markRead(id, unreadIds);
            
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

  async sendMessage(conversationId: string, command: SendMessageCommand): Promise<void> {
    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    const tempId = `temp-${Date.now()}`;
    
    const queuedAttachments: QueuedAttachment[] = [];
    if (command.attachments) {
      for (const sel of command.attachments) {
        for (const file of sel.files) {
          const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          
          let kind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' = 'FILE';
          if (file.type.startsWith('image/')) kind = 'IMAGE';
          else if (file.type.startsWith('video/')) kind = 'VIDEO';
          else if (file.type.startsWith('audio/')) kind = 'AUDIO';

          const pending: PendingAttachment = {
            id: attachmentId,
            blob: file,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            kind
          };
          
          await this.#db.saveAttachment(pending);
          
          queuedAttachments.push({
            attachmentId,
            uploadState: 'PENDING',
            uploadProgress: 0
          });
        }
      }
    }

    const payload: SendMessageDto = {
      content: command.content,
      embeds: command.embeds
    };
    
    this.#queue.enqueue(conversationId, tempId, payload, queuedAttachments);
    
    const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
    this.#store.setMessages(conversationId, merged);

    await this._tryProcessQueueItem(conversationId, tempId, currentUserId);
  }

  retryMessage(conversationId: string, messageId: string): void {
    const pending = this.#queue.getAll().find(m => m.id === messageId);
    if (!pending) return;

    if (pending.status === 'FAILED_UPLOAD') {
      this.#queue.updateStatus(messageId, 'QUEUED');
    } else if (pending.status === 'FAILED_SEND') {
      this.#queue.updateStatus(messageId, 'UPLOADED');
    } else {
      this.#queue.updateStatus(messageId, 'QUEUED');
    }
    
    const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
    this.#store.setMessages(conversationId, merged);

    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    this._tryProcessQueueItem(conversationId, messageId, currentUserId);
  }

  discardMessage(conversationId: string, messageId: string): void {
    const pending = this.#queue.getAll().find(m => m.id === messageId);
    if (pending && pending.attachments) {
      for (const qa of pending.attachments) {
        this.#db.deleteAttachment(qa.attachmentId);
      }
    }
    this.#queue.remove(messageId);
    const merged = this._mergePendingMessages(conversationId, this._getServerMessages(conversationId));
    this.#store.setMessages(conversationId, merged);
  }

  private async _tryProcessQueueItem(conversationId: string, tempId: string, currentUserId: string): Promise<void> {
    let pending = this.#queue.getAll().find(m => m.id === tempId);
    if (!pending) return;

    if (pending.status === 'QUEUED' || pending.status === 'FAILED_UPLOAD') {
      this.#queue.updateStatus(tempId, 'UPLOADING');
      
      let uploadSuccess = true;
      if (pending.attachments && pending.attachments.length > 0) {
        for (const qa of pending.attachments) {
          if (qa.uploadState === 'COMPLETED') continue;

          this.#queue.updateAttachment(tempId, qa.attachmentId, { uploadState: 'UPLOADING', uploadProgress: 0 });
          
          try {
            const pendingAtt = await this.#db.getAttachment(qa.attachmentId);
            if (!pendingAtt) throw new Error('Attachment blob not found in IDB');
            
            const fileToUpload = new File([pendingAtt.blob], pendingAtt.filename, { type: pendingAtt.mimeType });
            
            await new Promise<void>((resolve, reject) => {
              this.#media.uploadMedia('message', conversationId, 'MESSAGE', fileToUpload).subscribe({
                next: (state) => {
                  if (state.state === 'uploading') {
                    this.#queue.updateAttachment(tempId, qa.attachmentId, { uploadProgress: state.progress });
                  } else if (state.state === 'complete') {
                    this.#queue.updateAttachment(tempId, qa.attachmentId, { 
                      uploadState: 'COMPLETED',
                      uploadProgress: 100,
                      uploadedMediaId: state.media.id
                    });
                    resolve();
                  }
                },
                error: (err) => reject(err)
              });
            });
          } catch (err) {
            console.error('Failed to upload attachment', err);
            this.#queue.updateAttachment(tempId, qa.attachmentId, { uploadState: 'FAILED' });
            uploadSuccess = false;
          }
        }
      }

      if (!uploadSuccess) {
        this.#queue.updateStatus(tempId, 'FAILED_UPLOAD', 'Some attachments failed to upload');
        this.#store.setMessages(conversationId, this._mergePendingMessages(conversationId, this._getServerMessages(conversationId)));
        return;
      }
      
      this.#queue.updateStatus(tempId, 'UPLOADED');
    }

    pending = this.#queue.getAll().find(m => m.id === tempId);
    if (!pending) return;

    if (pending.status === 'UPLOADED' || pending.status === 'FAILED_SEND') {
      this.#queue.updateStatus(tempId, 'SENDING');
      
      const mediaIds: string[] = [];
      if (pending.attachments) {
        for (const qa of pending.attachments) {
          if (qa.uploadedMediaId) mediaIds.push(qa.uploadedMediaId);
        }
      }

      const dtoToSubmit: SendMessageDto = {
        ...pending.payload,
        attachmentIds: mediaIds.length > 0 ? mediaIds : undefined
      };

      try {
        const serverMessage = await firstValueFrom(
          this.#api.sendMessage(conversationId, dtoToSubmit).pipe(timeout(30000))
        );

        if (pending.attachments) {
          for (const qa of pending.attachments) {
            this.#db.deleteAttachment(qa.attachmentId).catch(e => console.error(e));
          }
        }
        
        this.#queue.remove(tempId);

        this.#store.messages.update(map => {
          const list = map[conversationId] || [];
          return {
            ...map,
            [conversationId]: list.map(m => m.id === tempId ? serverMessage : m)
          };
        });
      } catch (err: any) {
        if (pending.attemptCount < 3) {
          this.#queue.updateStatus(tempId, 'FAILED_SEND', err?.message || 'Network error');
          const backoffMs = Math.pow(2, pending.attemptCount) * 1000;
          setTimeout(() => {
            this._tryProcessQueueItem(conversationId, tempId, currentUserId);
          }, backoffMs);
        } else {
          this.#queue.updateStatus(tempId, 'FAILED_SEND', err?.message || 'Network error');
        }
        
        this.#store.setMessages(conversationId, this._mergePendingMessages(conversationId, this._getServerMessages(conversationId)));
      }
    }
  }

  private _getServerMessages(conversationId: string): IMessage[] {
    const current = this.#store.messages()[conversationId] || [];
    return current
      .filter(m => !m.syncState || m.syncState === 'SYNCED')
      .map(m => {
        if (!m.attachmentViews && m.attachments && m.attachments.length > 0) {
          return {
            ...m,
            attachmentViews: m.attachments.map(a => ({
              id: a.id,
              attachment: a,
              remoteUrl: a.url,
              isLocal: false,
              kind: a.mediaType
            }))
          };
        }
        return m;
      });
  }

  private _processQueue(): void {
    const all = this.#queue.getAll();
    const currentUserId = this.#auth.currentUser()?.id || 'unknown';
    
    for (const msg of all) {
      if (msg.status === 'QUEUED' || msg.status === 'FAILED_UPLOAD' || msg.status === 'UPLOADED' || msg.status === 'FAILED_SEND') {
        this._tryProcessQueueItem(msg.conversationId, msg.id, currentUserId);
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
      mediaUrl: p.payload.mediaUrl, // deprecated but fallback
      mediaType: p.payload.mediaType,
      embeds: p.payload.embeds ? p.payload.embeds.map((e, i) => ({
        id: `${p.id}-embed-${i}`,
        embedType: e.embedType,
        targetId: e.targetId,
        title: 'Shared Item'
      })) : [],
      attachmentViews: p.attachments ? p.attachments.map(qa => ({
        id: qa.attachmentId,
        localBlobId: qa.attachmentId,
        remoteUrl: qa.uploadedMediaId,
        isLocal: !qa.uploadedMediaId,
        kind: 'IMAGE' // Ideally we'd store kind on QueuedAttachment, fallback to IMAGE
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
