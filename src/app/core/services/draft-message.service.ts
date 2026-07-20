import { Service, signal, inject } from '@angular/core';
import { CacheService, CacheKeys } from './cache.service';

export interface EmbedReference {
  embedType: string;
  targetId: string;
}

export interface PendingMessage {
  embeds: EmbedReference[];
}

@Service()
export class DraftMessageService {
  #cache = inject(CacheService);

  // Keyed by recipient targetId (businessProfileId or participantId)
  #drafts = new Map<string, PendingMessage>();

  constructor() {
    const cached = this.#cache.get<Record<string, PendingMessage>>(CacheKeys.DRAFTS);
    if (cached) {
      this.#drafts = new Map(Object.entries(cached));
    }
  }

  private saveToCache(): void {
    const record = Object.fromEntries(this.#drafts);
    this.#cache.set(CacheKeys.DRAFTS, record);
  }

  // Signal to allow UI reactivity when drafts change
  readonly draftsChange = signal(0);

  setDraft(targetId: string, draft: PendingMessage): void {
    this.#drafts.set(targetId, draft);
    this.saveToCache();
    this.draftsChange.update((v) => v + 1);
  }

  getDraft(targetId: string): PendingMessage | null {
    return this.#drafts.get(targetId) || null;
  }

  clearDraft(targetId: string): void {
    if (this.#drafts.has(targetId)) {
      this.#drafts.delete(targetId);
      this.saveToCache();
      this.draftsChange.update((v) => v + 1);
    }
  }

  attachEmbed(targetId: string, embed: EmbedReference): void {
    const existing = this.getDraft(targetId);
    if (existing) {
      // Don't duplicate embeds
      if (
        !existing.embeds.find(
          (e) => e.embedType === embed.embedType && e.targetId === embed.targetId,
        )
      ) {
        existing.embeds.push(embed);
        this.setDraft(targetId, existing);
      }
    } else {
      this.setDraft(targetId, { embeds: [embed] });
    }
  }

  removeEmbed(targetId: string, targetEmbedId: string): void {
    const existing = this.getDraft(targetId);
    if (existing) {
      existing.embeds = existing.embeds.filter((e) => e.targetId !== targetEmbedId);
      if (existing.embeds.length === 0) {
        this.clearDraft(targetId);
      } else {
        this.setDraft(targetId, existing);
      }
    }
  }
}
