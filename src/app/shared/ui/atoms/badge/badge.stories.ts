import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { Badge } from './badge';

@Component({
  selector: 'app-badge-story',
  standalone: true,
  imports: [Badge],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Intents</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <app-badge intent="primary">Primary</app-badge>
          <app-badge intent="success">Success</app-badge>
          <app-badge intent="warning">Warning</app-badge>
          <app-badge intent="error">Error</app-badge>
          <app-badge intent="neutral">Neutral</app-badge>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Sizes</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <app-badge size="sm" intent="primary">Small</app-badge>
          <app-badge size="md" intent="primary">Medium</app-badge>
          <app-badge size="lg" intent="primary">Large</app-badge>
        </div>
      </section>

    </div>
  `
})
class BadgeStoryComponent {}

const meta: Meta<Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
};
export default meta;

export const RegressionGrid: StoryObj<Badge> = {
  render: () => ({
    moduleMetadata: {
      imports: [BadgeStoryComponent],
    },
    template: `<app-badge-story />`,
  }),
};
