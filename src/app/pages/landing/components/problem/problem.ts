import { Component } from '@angular/core';
import { Section } from '../section/section';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [Section],
  templateUrl: './problem.html',
  styleUrl: './problem.css',
})
export class Problem {
  protected readonly content = {
    eyebrow: 'The Problem',

    title: [
      "Your neighborhood already has what you're looking for.",
      'It just needs to be easier to discover.',
    ],

    description:
      'Too often, discovering local businesses means asking friends, scrolling social media, or hoping someone has a recommendation. Oríta makes local discovery simple.',
  } as const;

  protected readonly today = [
    'Ask WhatsApp groups',
    'Scroll Instagram',
    'Search Facebook',
    'Hope someone knows',
  ];

  protected readonly orita = [
    'Search once',
    'Discover nearby',
    'Connect directly',
    'Visit confidently',
  ];
}
