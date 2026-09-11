import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar, AvatarSize, AvatarStatus } from 'ur-ui';
import { IdentityLink } from '../identity.model';

@Component({
  selector: 'ui-user-identity',
  standalone: true,
  imports: [Avatar, RouterLink],
  template: `
    @if (interactive() && activeLink()) {
      <a [routerLink]="activeLink()" (click)="$event.stopPropagation()" class="ui-identity-link">
        <app-avatar
          [src]="user().avatarUrl || null"
          [alt]="user().displayName"
          [fallback]="(user().displayName || user().username || 'U').charAt(0)"
          [size]="avatarSize()"
          [status]="resolvedStatus()"
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
      </a>
    } @else {
      <app-avatar
        [src]="user().avatarUrl || null"
        [alt]="user().displayName"
        [fallback]="(user().displayName || user().username || 'U').charAt(0)"
        [size]="avatarSize()"
        [status]="resolvedStatus()"
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
    }
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
    profileUrl?: any[] | string | null;
    status?: AvatarStatus | null;
  }>();

  status = input<AvatarStatus | undefined>();

  resolvedStatus = computed(() => {
    const s = this.status();
    if (s !== undefined && s !== null) return s;
    const u = this.user() as any;
    return u?.status || undefined;
  });

  size = input<'sm' | 'md' | 'lg'>('md');
  showUsername = input<boolean>(true);
  metadata = input<string | null>(null);
  interactive = input<boolean>(true);
  link = input<any[] | string | null>(null);

  activeLink = computed(() => {
    const l = this.link();
    if (l !== null && l !== undefined) return l;
    const u = this.user() as any;
    if (u?.profileUrl) return u.profileUrl;
    if (u?.username || u?.slug) return ['/u', u.username || u.slug];
    return null;
  });

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

