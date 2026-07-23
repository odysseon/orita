import { Component, input, computed, signal, effect, ViewEncapsulation, booleanAttribute, output } from '@angular/core';
import { LucideUser, LucideLogIn } from '@lucide/angular';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarLoading = 'lazy' | 'eager';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [LucideUser, LucideLogIn],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
  }
})
export class Avatar {
  src = input<string | null>();
  alt = input<string | null>('');
  fallback = input<string | null>();
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  loading = input<AvatarLoading>('lazy');
  status = input<AvatarStatus>();
  
  authenticated = input<boolean, unknown>(true, { transform: booleanAttribute });
  guestClick = output<void>();

  imageLoaded = signal(false);
  imageError = signal(false);

  constructor() {
    effect(() => {
      this.src(); // track it
      this.imageLoaded.set(false);
      this.imageError.set(false);
    }, { allowSignalWrites: true });
  }

  classes = computed(() => {
    const classList = [
      'avatar',
      `avatar--${this.size()}`,
      `avatar--${this.shape()}`
    ];
    if (!this.authenticated()) {
      classList.push('is-guest');
    }
    return classList.join(' ');
  });

  onLoad() {
    this.imageLoaded.set(true);
  }

  onError() {
    this.imageError.set(true);
  }
  
  onGuestClick() {
    if (!this.authenticated()) {
      this.guestClick.emit();
    }
  }
}
