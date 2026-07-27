import { Component } from '@angular/core';
import { Section } from '../section/section';
import { MarketingCard } from '../marketing-card/marketing-card';

interface Card {
  readonly title: string;

  readonly description: string;
}

@Component({
  selector: 'app-why-orita',
  standalone: true,
  imports: [Section, MarketingCard],
  templateUrl: './why-orita.html',
  styleUrl: './why-orita.css',
  
})
export class WhyOrita {
  protected readonly content = {
    eyebrow: 'Why Oríta',

    title: ['A better way', 'to discover local.'],

    description:
      'Built around people, not algorithms. Oríta helps you discover what matters nearby without unnecessary friction.',
  } as const;

  protected readonly cards: readonly Card[] = [
    {
      title: 'Discover hidden gems',
      description:
        'Find businesses, services and products that often go unnoticed despite their quality.',
    },

    {
      title: 'Connect directly',
      description:
        'Call, message on WhatsApp or visit businesses directly without unnecessary middlemen.',
    },

    {
      title: 'Explore with confidence',
      description: 'Browse photos, information and Store Tours before deciding where to go.',
    },
  ];
}
