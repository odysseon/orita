import { Component, input } from '@angular/core';
import { Stack } from '../stack/stack';

@Component({
  selector: 'ui-section',
  standalone: true,
  imports: [Stack],
  template: `
    <ui-stack gap="md">
      <header class="ui-section-header">
        <h2 class="ui-section-title">{{ title() }}</h2>
        @if (description()) {
          <p class="ui-section-description">{{ description() }}</p>
        }
      </header>
      <div class="ui-section-content">
        <ng-content></ng-content>
      </div>
    </ui-stack>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: var(--size-32);
    }
    .ui-section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }
    .ui-section-description {
      font-size: var(--font-size-md);
      color: var(--text-secondary);
      margin: var(--size-4) 0 0 0;
      line-height: var(--line-height-relaxed);
    }
  `]
})
export class Section {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
