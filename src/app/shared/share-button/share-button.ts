import { Component, input, inject, computed } from '@angular/core';
import { LucideShare } from '@lucide/angular';
import { ShareService } from '../../core/services/share.service';
import { Button, ButtonAppearance, ButtonIntent, ButtonShape, ButtonSize } from '@odysseon/ur-ui';

@Component({
  selector: 'app-share-button',
  imports: [LucideShare, Button],
  templateUrl: './share-button.html',
  styleUrl: './share-button.css',
})
export class ShareButton {
  readonly title = input<string>();
  readonly text = input<string>();
  readonly url = input<string>();

  // Style configurations
  readonly size = input<ButtonSize>('md');
  readonly appearance = input<ButtonAppearance>('ghost');
  readonly shape = input<ButtonShape>('circle');
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'icon' | 'action'>('icon');
  readonly label = input<string>('Share');

  #shareService = inject(ShareService);

  readonly computedAppearance = computed<ButtonAppearance>(() => {
    if (this.variant() === 'ghost') return 'ghost';
    if (this.variant() === 'action') return 'soft';
    return this.appearance();
  });

  readonly computedIntent = computed<ButtonIntent>(() => {
    if (this.variant() === 'primary') return 'primary';
    if (this.variant() === 'secondary') return 'secondary';
    return 'primary';
  });

  async onShare(): Promise<void> {
    await this.#shareService.share({
      title: this.title(),
      text: this.text(),
      url: this.url() || window.location.href,
    });
  }
}
