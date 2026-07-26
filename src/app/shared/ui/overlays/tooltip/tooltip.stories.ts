import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { TooltipDirective } from './tooltip';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-tooltip-story',
  standalone: true,
  imports: [TooltipDirective, Button],
  template: `
    <div style="padding: 4rem; display: flex; flex-direction: column; gap: 4rem; background: var(--surface-page); align-items: center;">
      
      <section style="text-align: center;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Positions</h3>
        <div style="display: flex; gap: 2rem; justify-content: center;">
          <button app-button appearance="outline" appTooltip="I am on top!" position="top-center">Top</button>
          <button app-button appearance="outline" appTooltip="I am on bottom!" position="bottom-center">Bottom</button>
          <button app-button appearance="outline" appTooltip="I am on left!" position="left-center">Left</button>
          <button app-button appearance="outline" appTooltip="I am on right!" position="right-center">Right</button>
        </div>
      </section>

      <section style="text-align: center;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Alignments (Bottom)</h3>
        <div style="display: flex; gap: 2rem; justify-content: center;">
          <button app-button appearance="outline" appTooltip="Starts here" position="bottom-start">Start</button>
          <button app-button appearance="outline" appTooltip="Centered" position="bottom-center">Center</button>
          <button app-button appearance="outline" appTooltip="Ends here" position="bottom-end">End</button>
        </div>
      </section>

      <section style="text-align: center;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Intents</h3>
        <div style="display: flex; gap: 2rem; justify-content: center;">
          <button app-button appearance="outline" appTooltip="Inverse (Default)" tooltipIntent="inverse">Inverse</button>
          <button app-button appearance="outline" appTooltip="Neutral" tooltipIntent="neutral">Neutral</button>
        </div>
      </section>

      <section style="text-align: center; margin-top: 5rem;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Collision Detection</h3>
        <p style="margin-bottom: 2rem; color: var(--text-secondary); max-width: 400px; font-family: sans-serif;">
          Scroll this view or resize the window so the button below is near an edge, then hover over it. The tooltip should flip to stay within the viewport.
        </p>
        <button app-button intent="primary" appTooltip="This is a long tooltip that will definitely collide if placed near an edge" position="bottom-start">
          Hover me near an edge
        </button>
      </section>
      
    </div>
  `
})
class TooltipStoryComponent {}

const meta: Meta<TooltipDirective> = {
  title: 'Overlays/Tooltip',
  component: TooltipDirective,
};
export default meta;

export const Showcase: StoryObj<TooltipDirective> = {
  render: () => ({
    moduleMetadata: {
      imports: [TooltipStoryComponent],
    },
    template: `<app-tooltip-story />`,
  }),
};
