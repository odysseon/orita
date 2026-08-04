import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { Skeleton } from './skeleton';

@Component({
  selector: 'app-skeleton-story',
  standalone: true,
  imports: [Skeleton],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Basic Example (Card)</h3>
        <div style="padding: 1rem; border: var(--size-1) solid var(--border-subtle); border-radius: var(--radius-md); max-width: 18.75rem;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <app-skeleton shape="circle" width="var(--size-40)" height="var(--size-40)"></app-skeleton>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
              <app-skeleton width="70%" height="1rem"></app-skeleton>
              <app-skeleton width="40%" height="0.8rem"></app-skeleton>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <app-skeleton width="100%" height="1rem"></app-skeleton>
            <app-skeleton width="100%" height="1rem"></app-skeleton>
            <app-skeleton width="80%" height="1rem"></app-skeleton>
          </div>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Shapes</h3>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <app-skeleton shape="text" width="calc(var(--size-10) * 10)" height="1.2rem"></app-skeleton>
          <app-skeleton shape="rect" width="calc(var(--size-10) * 10)" height="calc(var(--size-10) * 6)"></app-skeleton>
          <app-skeleton shape="circle" width="calc(var(--size-10) * 6)" height="calc(var(--size-10) * 6)"></app-skeleton>
        </div>
      </section>

    </div>
  `
})
class SkeletonStoryComponent {}

const meta: Meta<Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
};
export default meta;

export const RegressionGrid: StoryObj<Skeleton> = {
  render: () => ({
    moduleMetadata: {
      imports: [SkeletonStoryComponent],
    },
    template: `<app-skeleton-story />`,
  }),
};
