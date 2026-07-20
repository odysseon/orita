import { Service, inject } from '@angular/core';
import { SendMessageDto, QueuedMessage } from './messaging.types';
import { DatabaseService } from './database.service';

@Service()
export class OutgoingMessageQueue {
  #db = inject(DatabaseService);
  
  private queue: QueuedMessage[] = [];
  private isLoaded = false;
  
  // Guard against concurrent processing loops
  isProcessing = false;

  async load(): Promise<void> {
    if (this.isLoaded) return;
    
    const messages = await this.#db.getQueuedMessages();
    let modified = false;
    
    // Recover interrupted SENDING messages -> LOCAL
    for (const msg of messages) {
      if (msg.status === 'SENDING') {
        msg.status = 'LOCAL';
        modified = true;
      }
    }
    
    this.queue = messages;
    this.isLoaded = true;

    // Persist any recoveries immediately, asynchronously
    if (modified) {
      Promise.all(this.queue.map(msg => this.#db.saveQueuedMessage(msg))).catch(err => {
        console.error('Failed to persist recovered queue', err);
      });
    }
  }

  getAll(): QueuedMessage[] {
    return this.queue;
  }

  enqueue(conversationId: string, id: string, payload: SendMessageDto): QueuedMessage {
    const msg: QueuedMessage = {
      id,
      conversationId,
      payload,
      attemptCount: 0,
      lastError: null,
      lastAttemptAt: null,
      createdAt: Date.now(),
      status: 'LOCAL'
    };
    this.queue.push(msg);
    
    // Asynchronously persist
    this.#db.saveQueuedMessage(msg).catch(err => console.error('Failed to persist queued message', err));
    
    return msg;
  }

  updateStatus(
    id: string, 
    status: 'LOCAL' | 'SENDING' | 'FAILED', 
    error?: string
  ): void {
    const idx = this.queue.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.queue[idx].status = status;
      if (status === 'SENDING') {
        this.queue[idx].attemptCount += 1;
        this.queue[idx].lastAttemptAt = Date.now();
      }
      if (error) {
        this.queue[idx].lastError = error;
      }
      
      const updatedMsg = { ...this.queue[idx] };
      // Asynchronously persist
      this.#db.saveQueuedMessage(updatedMsg).catch(err => console.error('Failed to persist queue status', err));
    }
  }

  remove(id: string): void {
    this.queue = this.queue.filter(m => m.id !== id);
    // Asynchronously persist
    this.#db.deleteQueuedMessage(id).catch(err => console.error('Failed to delete queued message', err));
  }

  getForConversation(conversationId: string): QueuedMessage[] {
    return this.queue.filter(m => m.conversationId === conversationId);
  }
}
