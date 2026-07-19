import { Component, input, computed, signal, effect, output } from '@angular/core';
import { LucideUser } from '@lucide/angular';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [LucideUser],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  authenticated = input<boolean>(true);
  src = input<string | null | undefined>(null);
  name = input<string>('');
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  status = input<AvatarStatus | null>(null);
  badgeCount = input<number | null>(null);

  /** Fires on click, but only in the guest state — a natural hook to open sign-in. */
  guestClick = output<void>();
  /** Fires on click when authenticated. */
  avatarClick = output<void>();

  #imgFailed = signal(false);

  constructor() {
    effect(() => {
      this.src();
      this.#imgFailed.set(false);
    });
  }

  initials = computed(() => {
    if (!this.authenticated()) return '';
    const n = this.name().trim();
    if (!n) return '?';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return Array.from(parts[0])[0].toUpperCase();
    return (Array.from(parts[0])[0] + Array.from(parts[parts.length - 1])[0]).toUpperCase();
  });

  showImage = computed(() => this.authenticated() && !!this.src() && !this.#imgFailed());

  badgeLabel = computed(() => {
    if (!this.authenticated()) return null;
    const c = this.badgeCount();
    if (!c || c <= 0) return null;
    return c > 99 ? '99+' : String(c);
  });

  onImgError(): void {
    this.#imgFailed.set(true);
  }

  onClick(event: Event): void {
    if (!this.authenticated()) {
      event.stopPropagation();
      this.guestClick.emit();
    } else {
      this.avatarClick.emit();
    }
  }
}
