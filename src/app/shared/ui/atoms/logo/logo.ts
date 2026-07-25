import { Component, input, HostBinding } from '@angular/core';

export type LogoVariant = 'full' | 'mark' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-logo',
  standalone: true,
  template: `
    @if (variant() === 'full' || variant() === 'mark') {
      <span class="mark">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="logo-svg">
          <rect width="100" height="100" rx="12" fill="var(--logo-bg, oklch(55% 0.22 280))" />
          <path d="M72 58Q60 68 50 61C30 48 32 30 50 27 68 30 70 48 50 61 40 68 28 58 28 58" fill="none" stroke="var(--logo-stroke, #fff)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
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
