import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div class="avatar-container" [class]="sizeClass()">
      @if (avatarUrl()) {
        <img class="avatar-image" [src]="avatarUrl()" [alt]="altText()" />
      } @else {
        <div class="avatar-fallback" aria-hidden="true">
          <span>{{ initial() }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './avatar.css',
})
export class AppAvatar {
  readonly avatarUrl = input<string | null | undefined>(null);
  readonly altText = input<string>('Avatar');
  readonly username = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  readonly initial = computed(() => {
    const name = this.username() || this.altText() || '?';
    return name.charAt(0).toUpperCase();
  });

  readonly sizeClass = computed(() => `avatar--${this.size()}`);
}
