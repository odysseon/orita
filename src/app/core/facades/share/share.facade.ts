import { Service, inject, signal } from '@angular/core';
import { ShareIntent, ShareTarget } from '../../types/share.types.js';
import { LinkBuilderService } from './link-builder.service.js';
import { NativeShareService } from './native-share.service.js';
import { ClipboardService } from './clipboard.service.js';
import { MessagingRepository } from '../../services/messaging-repository.service.js';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export type ShareStatus = 'idle' | 'opening' | 'sending' | 'failed' | 'complete';

@Service()
export class ShareFacade {
  #linkBuilder = inject(LinkBuilderService);
  #nativeShare = inject(NativeShareService);
  #clipboard = inject(ClipboardService);
  #messaging = inject(MessagingRepository);
  #router = inject(Router);

  status = signal<ShareStatus>('idle');
  recentChats = signal<any[]>([]); // Using any for now to avoid deep type imports if not available

  constructor() {
    this.loadRecentChats();
  }

  async loadRecentChats() {
    try {
      const chats = await firstValueFrom(this.#messaging.getConversations());
      this.recentChats.set(chats);
    } catch (e) {
      console.error('Failed to load recent chats', e);
    }
  }

  async copyLink(intent: ShareIntent): Promise<void> {
    try {
      this.status.set('sending');
      const url = this.#linkBuilder.buildLink(intent);
      await this.#clipboard.copy(url);
      this.status.set('complete');
    } catch (e) {
      this.status.set('failed');
      throw e;
    } finally {
      setTimeout(() => { if (this.status() === 'complete' || this.status() === 'failed') this.status.set('idle'); }, 2000);
    }
  }

  async nativeShare(intent: ShareIntent): Promise<void> {
    try {
      this.status.set('sending');
      const url = this.#linkBuilder.buildLink(intent);
      await this.#nativeShare.share(url);
      this.status.set('complete');
    } catch (e) {
      this.status.set('failed');
      throw e;
    } finally {
      setTimeout(() => { if (this.status() === 'complete' || this.status() === 'failed') this.status.set('idle'); }, 2000);
    }
  }

  async share(intent: ShareIntent, target: ShareTarget): Promise<void> {
    this.status.set('opening');
    try {
      let conversationId = '';

      if (target.kind === 'conversation') {
        conversationId = target.conversationId;
      } else {
        // Must be a user target, let's open conversation
        const conversation = await firstValueFrom(
          this.#messaging.openConversation('USER', target.userId)
        );
        conversationId = conversation.id;
      }

      this.status.set('sending');
      // For Milestone 1, we just send a link. Milestone 2 will send a MessageEmbed.
      const url = this.#linkBuilder.buildLink(intent);
      
      await firstValueFrom(
        this.#messaging.sendMessage(conversationId, {
          content: url, // Sending link as text message for now
        })
      );

      this.status.set('complete');
      
      // Navigate to the conversation
      await this.#router.navigate(['/messages', conversationId]);

    } catch (error) {
      this.status.set('failed');
      throw error;
    } finally {
      setTimeout(() => { if (this.status() === 'complete' || this.status() === 'failed') this.status.set('idle'); }, 2000);
    }
  }
}
