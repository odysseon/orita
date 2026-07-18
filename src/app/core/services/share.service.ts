import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from './toast';

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export interface SuggestedShareRecipientDto {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface RecentShareableDto {
  type: 'BUSINESS' | 'LISTING' | 'TOUR';
  targetId: string;
  title: string;
  imageUrl?: string;
  lastInteractedAt: string;
}

export interface ShareableSearchResult {
  type: 'BUSINESS' | 'LISTING' | 'TOUR';
  targetId: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface InternalShareDto {
  embedType: 'BUSINESS' | 'LISTING' | 'TOUR' | 'LOCATION';
  targetId: string;
  recipientIds: string[];
  content?: string;
}

export interface ShareResultDto {
  recipientId: string;
  conversationId: string;
  messageId: string;
}

@Service()
export class ShareService {
  #platformId = inject(PLATFORM_ID);
  #toast = inject(ToastService);
  #http = inject(HttpClient);

  readonly isSupported = isPlatformBrowser(this.#platformId) && !!navigator.share;

  async share(data: ShareData): Promise<void> {
    if (!isPlatformBrowser(this.#platformId)) return;

    if (this.isSupported) {
      try {
        await navigator.share(data);
      } catch (err) {
        // AbortError is perfectly normal (user canceled share sheet). We only care about other errors.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        this.#fallback(data);
      }
    } else {
      this.#fallback(data);
    }
  }

  async #fallback(data: ShareData): Promise<void> {
    const textToCopy = data.url || data.text || '';
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      this.#toast.success('Link copied', 'The link has been copied to your clipboard.');
    } catch (err) {
      this.#toast.error('Copy failed', 'Unable to copy to clipboard.');
    }
  }

  async getSuggestedRecipients(): Promise<SuggestedShareRecipientDto[]> {
    return firstValueFrom(this.#http.get<SuggestedShareRecipientDto[]>('/api/sharing/suggested-recipients'));
  }

  async getRecentShares(): Promise<RecentShareableDto[]> {
    return firstValueFrom(this.#http.get<RecentShareableDto[]>('/api/sharing/recent'));
  }

  async searchShareables(query: string): Promise<ShareableSearchResult[]> {
    return firstValueFrom(this.#http.get<ShareableSearchResult[]>(`/api/search/shareables`, { params: { q: query } }));
  }

  async shareInternal(dto: InternalShareDto): Promise<ShareResultDto[]> {
    return firstValueFrom(this.#http.post<ShareResultDto[]>('/api/share/internal', dto));
  }
}
