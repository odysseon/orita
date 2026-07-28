import { Service, signal, computed } from '@angular/core';
import { IConversation, IConversationPreview, IMessage, IMessagePreview } from './messaging.types';

@Service()
export class MessageStore {
  readonly conversations = signal<IConversationPreview[]>([]);
  readonly activeConversationId = signal<string | null>(null);
  readonly activeConversationDetails = signal<IConversation | null>(null);
  
  // A map of conversationId -> messages array
  readonly messages = signal<Record<string, IMessage[]>>({});

  // A map of conversationId -> load status and error
  readonly conversationStatus = signal<Record<string, 'idle' | 'loading' | 'loaded' | 'error'>>({});
  readonly conversationError = signal<Record<string, any>>({});

  readonly activeConversation = computed(() => {
    const id = this.activeConversationId();
    if (!id) return null;
    
    const preview = this.conversations().find(c => c.id === id);
    const details = this.activeConversationDetails();
    
    if (!preview && !details) return null;
    
    if (preview && details) {
      return { 
        ...details, 
        title: preview.title, 
        avatarUrl: preview.avatarUrl,
        unreadCount: preview.unreadCount,
        lastActivityAt: preview.lastActivityAt
      };
    }
    
    // If only details exist (e.g. freshly created conversation without preview loaded yet)
    if (details) {
      return {
        ...details,
        title: details.title || 'Conversation',
        avatarUrl: details.avatarUrl || null,
        unreadCount: details.unreadCount || 0,
        lastActivityAt: details.updatedAt
      } as IConversation & IConversationPreview;
    }
    
    return preview || null;
  });

  readonly activeMessages = computed(() => {
    const id = this.activeConversationId();
    if (!id) return [];
    return this.messages()[id] || [];
  });

  setConversations(conversations: IConversationPreview[]): void {
    this.conversations.set(conversations);
  }

  setMessages(conversationId: string, messages: IMessage[]): void {
    this.messages.update(map => ({
      ...map,
      [conversationId]: messages
    }));
  }

  setConversationStatus(conversationId: string, status: 'idle' | 'loading' | 'loaded' | 'error', error?: any): void {
    this.conversationStatus.update(map => ({
      ...map,
      [conversationId]: status
    }));
    if (error !== undefined) {
      this.conversationError.update(map => ({
        ...map,
        [conversationId]: error
      }));
    }
  }

  addMessage(message: IMessage): void {
    const cid = message.conversationId;
    
    // Update messages map
    this.messages.update(map => {
      const existing = map[cid] || [];
      // Replace optimistic message if it exists (matching by temp id or correlationId)
      const filtered = existing.filter(m => 
        m.id !== message.id && 
        (!message.correlationId || m.id !== message.correlationId)
      );
      const deduplicated = [...filtered, message].filter((m, idx, self) => 
        idx === self.findIndex(x => x.id === m.id)
      );
      return {
        ...map,
        [cid]: deduplicated
      };
    });

    // Update conversation latest message in sidebar
    this.conversations.update(list => {
      const idx = list.findIndex(c => c.id === cid);
      if (idx === -1) return list; // Or we could fetch it
      const copy = [...list];
      
      let descriptor: import('./messaging.types').IMessagePreviewDescriptor;
      if (message.embeds?.length) {
        descriptor = { kind: 'EMBED', embedType: message.embeds[0].embedType };
      } else if (message.mediaUrl) {
        descriptor = { kind: 'ATTACHMENT', attachmentType: message.mediaType || 'IMAGE' };
      } else if (message.content) {
        descriptor = { kind: 'TEXT', text: message.content };
      } else {
        descriptor = { kind: 'SYSTEM', text: 'Sent a message' };
      }

      const preview: IMessagePreview = {
        id: message.id,
        content: message.content,
        participantId: message.participantId,
        senderDisplayName: message.senderDisplayName,
        createdAt: message.createdAt,
        descriptor
      };

      copy[idx] = { ...copy[idx], latestMessage: preview, lastActivityAt: message.createdAt };
      
      // Bump to top
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      
      return copy;
    });
  }

  markMessagesRead(conversationId: string, messageIds: string[], readAt: string): void {
    this.messages.update(map => {
      const existing = map[conversationId];
      if (!existing) return map;
      
      const updated = existing.map(m => {
        if (messageIds.includes(m.id)) {
          // In a real app we'd map participantId too. Keeping it simple.
          return { ...m, readReceipts: [...m.readReceipts, { messageId: m.id, participantId: 'self', readAt }] };
        }
        return m;
      });

      return {
        ...map,
        [conversationId]: updated
      };
    });
  }

  markConversationRead(conversationId: string): void {
    this.conversations.update(list => {
      const idx = list.findIndex(c => c.id === conversationId);
      if (idx === -1) return list;
      
      const copy = [...list];
      copy[idx] = { ...copy[idx], unreadCount: 0 };
      return copy;
    });
  }

  setActiveConversationId(id: string | null): void {
    this.activeConversationId.set(id);
    if (!id) {
      this.activeConversationDetails.set(null);
    }
  }

  setActiveConversationDetails(conversation: IConversation): void {
    this.activeConversationDetails.set(conversation);
  }

  clear(): void {
    this.conversations.set([]);
    this.activeConversationId.set(null);
    this.activeConversationDetails.set(null);
    this.messages.set({});
    this.conversationStatus.set({});
    this.conversationError.set({});
  }
}
