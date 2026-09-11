import { Component, input, output, computed, inject } from '@angular/core';
import { Button, ButtonAppearance } from 'ur-ui';
import { LucideBookmark } from '@lucide/angular';
import { SAVE_BUTTON_I18N } from './save-button.config';

@Component({
  selector: 'ui-save-button',
  standalone: true,
  imports: [Button, LucideBookmark],
  templateUrl: './save-button.html',
  styleUrl: './save-button.css',
})
export class SaveButton {
  private i18n = inject(SAVE_BUTTON_I18N);

  isSaved = input.required<boolean>();
  appearance = input<ButtonAppearance>('ghost');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  /** `true` = user wants to save; `false` = user wants to unsave */
  toggle = output<boolean>();

  label = computed(() => (this.isSaved() ? this.i18n.unsave : this.i18n.save));
}
