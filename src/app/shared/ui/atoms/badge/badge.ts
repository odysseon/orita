import { Component, input, computed, ViewEncapsulation } from '@angular/core';

export type BadgeIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';
export type BadgeAppearance = 'solid' | 'soft' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge, [app-badge]',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class Badge {
  intent = input<BadgeIntent>('neutral');
  appearance = input<BadgeAppearance>('soft');
  size = input<BadgeSize>('md');

  classes = computed(() => {
    return [
      'badge',
      `intent-${this.intent()}`,
      `badge--${this.appearance()}`,
      `badge--${this.size()}`,
    ].join(' ');
  });
}
