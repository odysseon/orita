import { Component, input, output, computed, inject } from '@angular/core';
import { Button, ButtonSize, ButtonLayout } from '../../atoms/button/button';
import { LucideUserPlus, LucideUserCheck, LucideLoaderCircle } from '@lucide/angular';
import { FollowButtonDisplay } from './follow-button.types';
import { FOLLOW_BUTTON_I18N } from './follow-button.config';

@Component({
  selector: 'ui-follow-button',
  standalone: true,
  imports: [Button, LucideUserPlus, LucideUserCheck, LucideLoaderCircle],
  templateUrl: './follow-button.html',
  styleUrl: './follow-button.css',
})
export class FollowButton {
  private i18n = inject(FOLLOW_BUTTON_I18N);

  isFollowed = input.required<boolean>();
  size = input<ButtonSize>('md');
  display = input<FollowButtonDisplay>('text');
  layout = input<ButtonLayout>('horizontal');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  toggle = output<void>();

  isDisabled = computed(() => this.disabled() || this.loading());
  intent = computed(() => (this.isFollowed() ? 'secondary' : 'primary'));
  appearance = computed(() => (this.isFollowed() ? 'outline' : 'solid'));
  label = computed(() => (this.isFollowed() ? this.i18n.following : this.i18n.followed));
}
