import { Service } from '@angular/core';
import { SendMessageDto } from './messaging.types';

export interface OutgoingMessage {
  id: string;
  conversationId: string;
  payload: SendMessageDto;
  attemptCount: number;
  lastError: string | null;
  lastAttemptAt: number | null;
  createdAt: number;
  status: 'LOCAL' | 'SENDING' | 'FAILED';
}

@Service()
export class OutgoingMessageQueue {
  private readonly STORAGE_KEY = 'orita_outgoing_messages';

  getAll(): OutgoingMessage[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveAll(queue: OutgoingMessage[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.error('Failed to save outgoing messages queue', err);
    }
  }

  enqueue(conversationId: string, id: string, payload: SendMessageDto): OutgoingMessage {
    const queue = this.getAll();
    const msg: OutgoingMessage = {
      id,
      conversationId,
      payload,
      attemptCount: 0,
      lastError: null,
      lastAttemptAt: null,
      createdAt: Date.now(),
      status: 'LOCAL'
    };
    queue.push(msg);
    this.saveAll(queue);
    return msg;
  }

  updateStatus(
    id: string, 
    status: 'LOCAL' | 'SENDING' | 'FAILED', 
    error?: string
  ): void {
    const queue = this.getAll();
    const idx = queue.findIndex(m => m.id === id);
    if (idx !== -1) {
      queue[idx].status = status;
      if (status === 'SENDING') {
        queue[idx].attemptCount += 1;
        queue[idx].lastAttemptAt = Date.now();
      }
      if (error) {
        queue[idx].lastError = error;
      }
      this.saveAll(queue);
    }
  }

  remove(id: string): void {
    let queue = this.getAll();
    queue = queue.filter(m => m.id !== id);
    this.saveAll(queue);
  }

  getForConversation(conversationId: string): OutgoingMessage[] {
    return this.getAll().filter(m => m.conversationId === conversationId);
  }
}
