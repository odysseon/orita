import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { Avatar, AvatarSize, AvatarShape } from '../../../atoms/avatar/avatar';
import { LucideBadgeCheck } from '@lucide/angular';

@Component({
  selector: 'ui-business-identity',
  standalone: true,
  imports: [Avatar, LucideBadgeCheck],
  template: `
    <app-avatar
      [src]="business().logoUrl || null"
      [alt]="business().name"
      [fallback]="business().name.charAt(0)"
      [size]="avatarSize()"
      [shape]="avatarShape()"
    ></app-avatar>
    <div class="ui-business-identity-info">
      <div class="ui-business-identity-name-row">
        <div class="ui-business-identity-name">{{ business().name }}</div>
        @if (verificationStatus() === 'verified') {
          <svg lucideBadgeCheck class="ui-business-identity-verified-icon" aria-hidden="true"></svg>
        }
      </div>
      @if (showCategory() && business().category) {
        <div class="ui-business-identity-category">{{ business().category }}</div>
      }
    </div>
  `,
  styleUrl: './business-identity.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()'
  }
})
export class BusinessIdentity {
  business = input.required<{
    id: string;
    name: string;
    logoUrl?: string | null;
    category?: string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showCategory = input<boolean>(true);
  verificationStatus = input<'verified' | 'unverified'>('unverified');

  avatarSize = computed<AvatarSize>(() => {
    switch (this.size()) {
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
    }
  });

  avatarShape = computed<AvatarShape>(() => 'rounded');

  classes = computed(() => {
    return `ui-business-identity ui-business-identity--${this.size()}`;
  });
}
