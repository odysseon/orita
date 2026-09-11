import { Component, input, output, computed, inject } from '@angular/core';
import { Button, ButtonAppearance } from '@odysseon/ur-ui';
import { LucidePaperclip } from '@lucide/angular';
import { ATTACH_BUTTON_I18N } from './attach-button.config';

@Component({
  selector: 'ui-attach-button',
  standalone: true,
  imports: [Button, LucidePaperclip],
  templateUrl: './attach-button.html',
  styleUrl: './attach-button.css',
})
export class AttachButton {
  private i18n = inject(ATTACH_BUTTON_I18N);

  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  appearance = input<ButtonAppearance>('ghost');

  attach = output<void>();

  label = computed(() => this.i18n.attach);
}
