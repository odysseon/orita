import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar, AvatarSize, AvatarShape } from '../avatar/avatar';
import { LucideBadgeCheck } from '@lucide/angular';
import { IdentityLink } from '../identity.model';

@Component({
  selector: 'ui-business-identity',
  standalone: true,
  imports: [Avatar, LucideBadgeCheck, RouterLink],
  template: `
    @if (interactive() && activeLink()) {
      <a [routerLink]="activeLink()" (click)="$event.stopPropagation()" class="ui-identity-link">
        <app-avatar
          [src]="business().logoUrl || null"
          [alt]="business().name"
          [fallback]="business().name.charAt(0)"
          [size]="avatarSize()"
          [shape]="avatarShape()"
        ></app-avatar>
        <div class="ui-business-identity-info">
          <div class="ui-business-identity-name-row">
            <div class="ui-business-identity-name truncate">{{ business().name }}</div>
            @if (verificationStatus() === 'verified') {
              <svg lucideBadgeCheck class="ui-business-identity-verified-icon" aria-hidden="true"></svg>
            }
          </div>
          @if (showCategory() && business().category) {
            <div class="ui-business-identity-category truncate">{{ business().category }}</div>
          }
        </div>
      </a>
    } @else {
      <app-avatar
        [src]="business().logoUrl || null"
        [alt]="business().name"
        [fallback]="business().name.charAt(0)"
        [size]="avatarSize()"
        [shape]="avatarShape()"
      ></app-avatar>
      <div class="ui-business-identity-info">
        <div class="ui-business-identity-name-row">
          <div class="ui-business-identity-name truncate">{{ business().name }}</div>
          @if (verificationStatus() === 'verified') {
            <svg lucideBadgeCheck class="ui-business-identity-verified-icon" aria-hidden="true"></svg>
          }
        </div>
        @if (showCategory() && business().category) {
          <div class="ui-business-identity-category truncate">{{ business().category }}</div>
        }
      </div>
    }
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
    slug?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    profileUrl?: any[] | string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showCategory = input<boolean>(true);
  verificationStatus = input<'verified' | 'unverified'>('unverified');
  interactive = input<boolean>(true);
  link = input<any[] | string | null>(null);

  activeLink = computed(() => {
    const l = this.link();
    if (l !== null && l !== undefined) return l;
    const biz = this.business() as any;
    if (biz?.profileUrl) return biz.profileUrl;
    if (biz?.slug) return ['/b', biz.slug];
    return null;
  });

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

