import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';
import { Card } from '../../../atoms/card/card';

@Component({
  selector: 'ui-location-identity',
  standalone: true,
  imports: [LucideMapPin, Card],
  template: `
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
    state?: string | null;
    country?: string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showDetails = input<boolean>(true);

  classes = computed(() => {
    return `ui-location-identity ui-location-identity--${this.size()}`;
  });
}
