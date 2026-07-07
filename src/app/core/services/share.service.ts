import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from './toast';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

@Service()
export class ShareService {
  #platformId = inject(PLATFORM_ID);
  #toast = inject(ToastService);

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
}
