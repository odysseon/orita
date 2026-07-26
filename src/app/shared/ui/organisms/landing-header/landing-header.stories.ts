import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { LandingHeader } from './landing-header';
import { provideRouter, ActivatedRoute } from '@angular/router';

const meta: Meta<LandingHeader> = {
  title: 'Organisms/Headers/LandingHeader',
  component: LandingHeader,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 300px; background: var(--surface-container-low); margin: -1rem;">
        <app-landing-header 
          [sticky]="sticky"
          [layout]="layout"
        ></app-landing-header>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<LandingHeader>;

export const Default: Story = {
  args: {
    sticky: true,
    layout: 'wide'
  },
};
