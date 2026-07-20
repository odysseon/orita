import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { IConversationPreview, IMessage, SendMessageDto, QueuedMessage, PendingAttachment } from './messaging.types';

export interface OritaDB extends DBSchema {
  outgoing_messages: {
    key: string;
    value: QueuedMessage;
    indexes: {
      'by-conversation': string;
      'by-status': string;
      'by-created': number;
    };
  };
  conversations: {
    key: string;
    value: IConversationPreview;
    indexes: {
      'by-updated': number;
    };
  };
  messages: {
    key: string;
    value: IMessage;
    indexes: {
      'by-conversation': string;
      'by-created': number;
    };
  };
  attachments: {
    key: string;
    value: any; // Future use
  };
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private dbPromise: Promise<IDBPDatabase<OritaDB>> | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = openDB<OritaDB>('orita-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('outgoing_messages')) {
            const outStore = db.createObjectStore('outgoing_messages', { keyPath: 'id' });
            outStore.createIndex('by-conversation', 'conversationId');
            outStore.createIndex('by-status', 'status');
            outStore.createIndex('by-created', 'createdAt');
          }
          if (!db.objectStoreNames.contains('conversations')) {
            const convStore = db.createObjectStore('conversations', { keyPath: 'id' });
            convStore.createIndex('by-updated', 'lastActivityAt'); // IConversationPreview uses lastActivityAt
          }
          if (!db.objectStoreNames.contains('messages')) {
            const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
            msgStore.createIndex('by-conversation', 'conversationId');
            msgStore.createIndex('by-created', 'createdAt');
          }
          if (!db.objectStoreNames.contains('attachments')) {
            db.createObjectStore('attachments', { keyPath: 'id' });
          }
        },
      });
    }
  }

  // --- Outgoing Messages ---

  async saveQueuedMessage(message: QueuedMessage): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    await db.put('outgoing_messages', message);
  }

  async getQueuedMessages(): Promise<QueuedMessage[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAll('outgoing_messages');
  }

  async deleteQueuedMessage(id: string): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    await db.delete('outgoing_messages', id);
  }

  // --- Conversations ---

  async saveConversationPreview(preview: IConversationPreview): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    await db.put('conversations', preview);
  }

  async saveConversationPreviews(previews: IConversationPreview[]): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    const tx = db.transaction('conversations', 'readwrite');
    await Promise.all([
      ...previews.map(p => tx.store.put(p)),
      tx.done
    ]);
  }

  async getConversationPreviews(): Promise<IConversationPreview[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAllFromIndex('conversations', 'by-updated'); // Get them sorted if possible
  }
  
  // --- Messages ---
  
  async saveMessage(message: IMessage): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    await db.put('messages', message);
  }

  async saveMessages(messages: IMessage[]): Promise<void> {
    if (!this.dbPromise) return;
    const db = await this.dbPromise;
    const tx = db.transaction('messages', 'readwrite');
    await Promise.all([
      ...messages.map(m => tx.store.put(m)),
      tx.done
    ]);
  }

  async getMessagesForConversation(conversationId: string): Promise<IMessage[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAllFromIndex('messages', 'by-conversation', conversationId);
  }
}
