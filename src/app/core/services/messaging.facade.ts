import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessagingApiService } from './messaging-api.service';
import { MessagingRepository } from './messaging-repository.service';
import { DraftMessageService, EmbedReference } from './draft-message.service';

@Service()
export class MessagingFacade {
  #router = inject(Router);
  #messagingRepo = inject(MessagingApiService);
  #messagingService = inject(MessagingRepository);
  #draftStore = inject(DraftMessageService);

  /**
   * Coordinate opening a conversation with a business and attaching a draft embed.
   */
  messageBusiness(businessId: string, embed?: EmbedReference): void {
    if (embed) {
      this.#draftStore.attachEmbed(businessId, embed);
    }

    this.#messagingRepo.openConversation('BUSINESS', businessId).subscribe({
      next: (conv) => {
        // If the backend returns a conversation, we might want to also transfer the draft
        // to be keyed by the conversationId if needed, but since our composer can read
        // by targetId or conversationId participants, keeping it keyed by businessId
        // works as long as the composer knows the targetId.
        // Actually, to make it seamless for the composer, we can move the draft from
        // businessId to conversationId right here, since the composer primarily works with conversationId.
        if (embed) {
          const draft = this.#draftStore.getDraft(businessId);
          if (draft) {
            this.#draftStore.setDraft(conv.id, draft);
            if (conv.id !== businessId) {
              this.#draftStore.clearDraft(businessId);
            }
          }
        }

        this.#messagingService.loadConversation(conv.id);
        this.#router.navigate(['/messages', conv.id]);
      },
      error: (err) => {
        console.error('Failed to open conversation', err);
      },
    });
  }
}
