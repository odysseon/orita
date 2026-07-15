import { Service, signal, computed } from '@angular/core';
import { IConversation, IMessage } from './messaging.types';

@Service()
export class MessageStore {
  readonly conversations = signal<IConversation[]>([]);
  readonly activeConversationId = signal<string | null>(null);
  
  // A map of conversationId -> messages array
  readonly messages = signal<Record<string, IMessage[]>>({});

  readonly activeConversation = computed(() => {
    const id = this.activeConversationId();
    if (!id) return null;
    return this.conversations().find(c => c.id === id) || null;
  });

  readonly activeMessages = computed(() => {
    const id = this.activeConversationId();
    if (!id) return [];
    return this.messages()[id] || [];
  });

  setConversations(conversations: IConversation[]): void {
    this.conversations.set(conversations);
  }

  setMessages(conversationId: string, messages: IMessage[]): void {
    this.messages.update(map => ({
      ...map,
      [conversationId]: messages
    }));
  }

  addMessage(message: IMessage): void {
    const cid = message.conversationId;
    
    // Update messages map
    this.messages.update(map => {
      const existing = map[cid] || [];
      // Replace optimistic message if it exists (matching by temp id)
      const filtered = existing.filter(m => m.id !== message.id);
      return {
        ...map,
        [cid]: [...filtered, message]
      };
    });

    // Update conversation latest message in sidebar
    this.conversations.update(list => {
      const idx = list.findIndex(c => c.id === cid);
      if (idx === -1) return list; // Or we could fetch it
      const copy = [...list];
      copy[idx] = { ...copy[idx], latestMessage: message };
      
      // Bump to top if you want
      // const [item] = copy.splice(idx, 1);
      // copy.unshift(item);
      
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

  setActiveConversationId(id: string | null): void {
    this.activeConversationId.set(id);
  }
}
