import { Component } from '@angular/core';

interface ComparisonColumn {
  readonly title: string;
  readonly items: readonly string[];
  readonly positive: boolean;
}

@Component({
  selector: 'app-problem',
  standalone: true,
  templateUrl: './problem.html',
  styleUrl: './problem.css',
})
export class Problem {
  protected readonly content = {
    eyebrow: 'Local discovery is harder than it should be',

    title: [
      "Your neighborhood already has what you're looking for.",
      'It just needs to be easier to discover.',
    ],

    description:
      'Too often, discovering local businesses means asking friends, scrolling social media, or hoping someone has a recommendation. Oríta brings businesses, services and products together in one place, making local discovery simple.',
  } as const;

  protected readonly columns: readonly ComparisonColumn[] = [
    {
      title: 'Today',
      positive: false,
      items: ['Ask WhatsApp groups', 'Scroll Instagram', 'Search Facebook', 'Hope someone knows'],
    },
    {
      title: 'With Oríta',
      positive: true,
      items: ['Search once', 'Discover nearby', 'Connect directly', 'Visit confidently'],
    },
  ];
}
