import { Component, input } from '@angular/core';

@Component({
  selector: 'app-legal-header',
  standalone: true,
  template: `
    <header class="legal-header">
      <h1 class="legal-header__title">{{ title() }}</h1>
      <div class="legal-header__metadata">
        <span><strong>Effective Date:</strong> {{ effectiveDate() }}</span>
        <span><strong>Last Updated:</strong> {{ lastUpdated() }}</span>
        <span><strong>Version:</strong> {{ version() }}</span>
      </div>
      <p class="legal-header__description">{{ description() }}</p>
    </header>
  `,
  styles: [`
    .legal-header {
      margin-bottom: var(--size-40);
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: var(--size-32);
    }
    .legal-header__title {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--size-16);
      font-weight: 700;
      color: var(--text-primary);
    }
    .legal-header__metadata {
      display: flex;
      gap: var(--size-24);
      margin-bottom: var(--size-24);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }
    .legal-header__metadata span {
      display: flex;
      gap: var(--size-8);
    }
    .legal-header__description {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
      line-height: 1.6;
    }
    @media (max-width: 768px) {
      .legal-header__metadata {
        flex-direction: column;
        gap: var(--size-8);
      }
    }
  `]
})
export class LegalHeader {
  title = input.required<string>();
  effectiveDate = input.required<string>();
  lastUpdated = input.required<string>();
  version = input.required<string>();
  description = input.required<string>();
}
