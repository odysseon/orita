import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { Alert } from './alert';

@Component({
  selector: 'app-alert-story',
  standalone: true,
  imports: [Alert],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; background: var(--surface-page);">
      
      <section style="display: flex; flex-direction: column; gap: 1rem;">
        <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-family: sans-serif;">Intents</h3>
        <app-alert intent="info" title="Information">
          This is an informational alert to give you context.
        </app-alert>
        
        <app-alert intent="success" title="Success!">
          Your operation was completed successfully.
        </app-alert>
        
        <app-alert intent="warning" title="Warning">
          Please be careful, this action is risky.
        </app-alert>
        
        <app-alert intent="error" title="Error!">
          Something went terribly wrong. Please try again.
        </app-alert>
      </section>

      <section style="display: flex; flex-direction: column; gap: 1rem;">
        <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-family: sans-serif;">Dismissible</h3>
        <app-alert intent="info" title="Dismiss Me" [dismissible]="true" (dismiss)="log('Dismissed!')">
          Click the X to dismiss this alert. (Callback logged to console)
        </app-alert>
      </section>

    </div>
  `
})
class AlertStoryComponent {
  log(m: string) { console.log(m); }
}

const meta: Meta<Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
};
export default meta;

export const RegressionGrid: StoryObj<Alert> = {
  render: () => ({
    moduleMetadata: {
      imports: [AlertStoryComponent],
    },
    template: `<app-alert-story />`,
  }),
};
