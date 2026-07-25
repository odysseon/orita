import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { Avatar, AvatarSize } from '../../../atoms/avatar/avatar';

@Component({
  selector: 'ui-user-identity',
  standalone: true,
  imports: [Avatar],
  template: `
    <app-avatar
      [src]="user().avatarUrl || null"
      [alt]="user().displayName"
      [fallback]="user().displayName.charAt(0)"
      [size]="avatarSize()"
    ></app-avatar>
    <div class="ui-user-identity-info">
      <div class="ui-user-identity-name truncate">{{ user().displayName }}</div>
      @if (showUsername() && user().username) {
        <div class="ui-user-identity-handle truncate">&#64;{{ user().username }}</div>
      }
      @if (metadata()) {
        <div class="ui-user-identity-metadata truncate">{{ metadata() }}</div>
      }
    </div>
  `,
  styleUrl: './user-identity.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()'
  }
})
export class UserIdentity {
  user = input.required<{
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showUsername = input<boolean>(true);
  metadata = input<string | null>(null);

  avatarSize = computed<AvatarSize>(() => {
    switch (this.size()) {
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
    }
  });

  classes = computed(() => {
    return `ui-user-identity ui-user-identity--${this.size()}`;
  });
}
