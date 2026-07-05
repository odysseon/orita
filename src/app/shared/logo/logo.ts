import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  readonly width = input<string | number>('15%');

  /** Height of the SVG (default: 'auto') */
  readonly height = input<string | number>('10%');

  /** Additional CSS classes to apply */
  readonly className = input<string>('');

  /** Primary color for the main shape and glow (default: brand primary) */
  readonly primaryColor = input<string>('var(--clr-primary)');

  /** Accent color for the destination dot (default: brand primary-light) */
  readonly accentColor = input<string>('var(--clr-primary-light)');
}
