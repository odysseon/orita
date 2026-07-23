import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { Divider } from './divider';

@Component({
  selector: 'app-divider-story',
  standalone: true,
  imports: [Divider],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page); font-family: sans-serif;">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Horizontal (Default)</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Content above</p>
        <app-divider></app-divider>
        <p style="color: var(--text-secondary); margin-top: 1rem;">Content below</p>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Vertical</h3>
        <div style="display: flex; align-items: center; height: 50px; gap: 1rem;">
          <span style="color: var(--text-secondary);">Left</span>
          <app-divider orientation="vertical"></app-divider>
          <span style="color: var(--text-secondary);">Right</span>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Variants</h3>
        
        <div style="margin-bottom: 2rem;">
          <p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.85rem;">Solid (Default)</p>
          <app-divider variant="solid"></app-divider>
        </div>

        <div style="margin-bottom: 2rem;">
          <p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.85rem;">Dashed</p>
          <app-divider variant="dashed"></app-divider>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.85rem;">Dotted</p>
          <app-divider variant="dotted"></app-divider>
        </div>
      </section>

    </div>
  `
})
class DividerStoryComponent {}

const meta: Meta<Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
};
export default meta;

export const RegressionGrid: StoryObj<Divider> = {
  render: () => ({
    moduleMetadata: {
      imports: [DividerStoryComponent],
    },
    template: `<app-divider-story />`,
  }),
};
