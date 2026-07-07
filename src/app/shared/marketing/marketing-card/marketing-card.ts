import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-marketing-card',
  standalone: true,
  templateUrl: './marketing-card.html',
  styleUrl: './marketing-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingCard {
  readonly title = input.required<string>();

  readonly description = input.required<string>();

  readonly eyebrow = input<string>();

  readonly accent = input<'primary' | 'surface'>('surface');
}
