import type { Meta, StoryObj } from '@storybook/angular';
import { Component, effect, signal } from '@angular/core';
import { Progress } from './progress';

@Component({
  selector: 'app-progress-story',
  standalone: true,
  imports: [Progress],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Determinate</h3>
        <app-progress [value]="30"></app-progress>
        <br>
        <app-progress [value]="75"></app-progress>
        <br>
        <app-progress [value]="100"></app-progress>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Indeterminate</h3>
        <app-progress></app-progress>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Intents</h3>
        <app-progress [value]="40" intent="primary"></app-progress>
        <br>
        <app-progress [value]="40" intent="success"></app-progress>
        <br>
        <app-progress [value]="40" intent="error"></app-progress>
      </section>

    </div>
  `
})
class ProgressStoryComponent {}

const meta: Meta<Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
};
export default meta;

export const RegressionGrid: StoryObj<Progress> = {
  render: () => ({
    moduleMetadata: {
      imports: [ProgressStoryComponent],
    },
    template: `<app-progress-story />`,
  }),
};
