import { Component, input, inject } from '@angular/core';
import { LucideShare } from '@lucide/angular';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-share-button',
  imports: [LucideShare],
  templateUrl: './share-button.html',
  styleUrl: './share-button.css'
})
export class ShareButton {
  readonly title = input<string>();
  readonly text = input<string>();
  readonly url = input<string>();
  
  // Style configurations
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'icon'>('icon');
  readonly label = input<string>('Share');

  #shareService = inject(ShareService);

  async onShare(): Promise<void> {
    await this.#shareService.share({
      title: this.title(),
      text: this.text(),
      url: this.url() || window.location.href // Default to current URL if none provided
    });
  }
}
