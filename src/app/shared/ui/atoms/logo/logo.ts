import { Component, input, HostBinding } from '@angular/core';

export type LogoVariant = 'full' | 'mark' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-logo',
  standalone: true,
  template: `
    @if (variant() === 'full' || variant() === 'mark') {
      <span class="mark">
        <img src="/android-chrome-192x192.png" alt="Oríta Logo" class="logo-icon" />
      </span>
    }
    @if (variant() === 'full' || variant() === 'wordmark') {
      <span class="wordmark">Oríta</span>
    }
  `,
  styleUrl: './logo.css',
})
export class Logo {
  variant = input<LogoVariant>('full');
  size = input<LogoSize>('md');

  @HostBinding('class') get hostClass() {
    return `logo variant-${this.variant()} size-${this.size()}`;
  }
}
