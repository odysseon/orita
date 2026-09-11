import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPin } from '@lucide/angular';
import { Card } from 'ur-ui';

@Component({
  selector: 'ui-location-identity',
  standalone: true,
  imports: [LucideMapPin, Card, RouterLink],
  template: `
    @if (interactive() && activeLink()) {
      <a [routerLink]="activeLink()" (click)="$event.stopPropagation()" class="ui-identity-link">
        <app-card padding="none" appearance="plain" style="display: flex; align-items: center; gap: var(--size-12); width: 100%;">
          <div class="ui-location-identity-icon-wrapper">
            <svg lucideMapPin class="ui-location-identity-icon" aria-hidden="true"></svg>
          </div>
          <div class="ui-location-identity-info">
            <div class="ui-location-identity-name">{{ location().name }}</div>
            @if (showDetails() && (location().state || location().country)) {
              <div class="ui-location-identity-details">
                {{ location().state }}{{ location().state && location().country ? ', ' : '' }}{{ location().country }}
              </div>
            }
          </div>
        </app-card>
      </a>
    } @else {
      <app-card padding="none" appearance="plain" style="display: flex; align-items: center; gap: var(--size-12);">
        <div class="ui-location-identity-icon-wrapper">
          <svg lucideMapPin class="ui-location-identity-icon" aria-hidden="true"></svg>
        </div>
        <div class="ui-location-identity-info">
          <div class="ui-location-identity-name">{{ location().name }}</div>
          @if (showDetails() && (location().state || location().country)) {
            <div class="ui-location-identity-details">
              {{ location().state }}{{ location().state && location().country ? ', ' : '' }}{{ location().country }}
            </div>
          }
        </div>
      </app-card>
    }
  `,
  styleUrl: './location-identity.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()'
  }
})
export class LocationIdentity {
  location = input.required<{
    id: string;
    name: string;
    slug?: string | null;
    state?: string | null;
    country?: string | null;
    profileUrl?: any[] | string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showDetails = input<boolean>(true);
  interactive = input<boolean>(true);
  link = input<any[] | string | null>(null);

  activeLink = computed(() => {
    const l = this.link();
    if (l !== null && l !== undefined) return l;
    const loc = this.location() as any;
    if (loc?.profileUrl) return loc.profileUrl;
    if (loc?.slug) return ['/locations', loc.slug];
    return null;
  });

  classes = computed(() => {
    return `ui-location-identity ui-location-identity--${this.size()}`;
  });
}

