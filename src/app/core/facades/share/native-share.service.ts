import { Service } from '@angular/core';

@Service()
export class NativeShareService {
  get isSupported(): boolean {
    return !!navigator.share;
  }

  async share(url: string, title?: string, text?: string): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Native sharing is not supported on this device.');
    }
    await navigator.share({ url, title, text });
  }
}
