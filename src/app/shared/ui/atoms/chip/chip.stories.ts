import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { Chip } from './chip';
import { LucideUser, LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-chip-story',
  standalone: true,
  imports: [Chip, LucideUser, LucideCheck],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Appearances</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button app-chip appearance="solid">Solid</button>
          <button app-chip appearance="outline">Outline</button>
          <button app-chip appearance="soft">Soft</button>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Intents</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button app-chip intent="neutral">Neutral</button>
          <button app-chip intent="primary">Primary</button>
          <button app-chip intent="success">Success</button>
          <button app-chip intent="warning">Warning</button>
          <button app-chip intent="error">Error</button>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">States (Selected, Disabled)</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button app-chip [selected]="true">Selected (Solid)</button>
          <button app-chip appearance="outline" [selected]="true">Selected (Outline)</button>
          <button app-chip disabled>Disabled</button>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">With Icons</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button app-chip>
            <svg lucideUser></svg>
            Profile
          </button>
          <button app-chip intent="success">
            <svg lucideCheck></svg>
            Done
          </button>
        </div>
      </section>

    </div>
  `
})
class ChipStoryComponent {}

const meta: Meta<Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
};
export default meta;

export const RegressionGrid: StoryObj<Chip> = {
  render: () => ({
    moduleMetadata: {
      imports: [ChipStoryComponent],
    },
    template: `<app-chip-story />`,
  }),
};
