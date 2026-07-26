import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Section } from '../section/section';
import { LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-store-tours',
  standalone: true,
  imports: [Section, LucideCheck],
  templateUrl: './store-tours.html',
  styleUrl: './store-tours.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTours {
  protected readonly content = {
    eyebrow: 'Store Tours',

    title: ['See before', 'you visit.'],

    description:
      'Some businesses on Oríta include immersive Store Tours, giving you a better feel for a place before you leave home.',
  } as const;

  protected readonly benefits = [
    'Know what to expect',

    'Build confidence before visiting',

    'Discover hidden gems',
  ] as const;
}
