import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Section } from '../section/section';

@Component({
  selector: 'app-belief',
  standalone: true,
  imports: [Section],
  templateUrl: './belief.html',
  styleUrl: './belief.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Belief {
  protected readonly content = {
    eyebrow: 'Our Belief',

    title: ['Every neighborhood', 'has businesses worth discovering.'],

    description:
      'The best businesses are not always the loudest. Great products, skilled professionals, trusted services and hidden gems exist all around us. They simply deserve to be easier to discover.',
  } as const;
}
