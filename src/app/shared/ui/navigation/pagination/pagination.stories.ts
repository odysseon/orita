import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { Pagination } from './pagination';

@Component({
  selector: 'app-pagination-story',
  standalone: true,
  imports: [Pagination],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Basic (Few Pages)</h3>
        <app-pagination 
          [currentPage]="page1()" 
          [totalPages]="5" 
          (pageChange)="page1.set($event)">
        </app-pagination>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">With Ellipsis</h3>
        <app-pagination 
          [currentPage]="page2()" 
          [totalPages]="20" 
          [siblingCount]="1"
          (pageChange)="page2.set($event)">
        </app-pagination>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Boundary Links (First/Last)</h3>
        <app-pagination 
          [currentPage]="page3()" 
          [totalPages]="100" 
          [siblingCount]="2"
          [showBoundaryLinks]="true"
          (pageChange)="page3.set($event)">
        </app-pagination>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Mobile Emulation (Collapses siblings)</h3>
        <div style="width: 375px; padding: 1rem; border: var(--size-1) dashed var(--border-strong);">
          <app-pagination 
            [currentPage]="page4()" 
            [totalPages]="40" 
            [siblingCount]="2"
            (pageChange)="page4.set($event)">
          </app-pagination>
        </div>
        <p style="margin-top: 0.5rem; font-family: sans-serif; font-size: 0.85rem; color: var(--text-muted);">
          Note: Mobile collapse is based on actual window.matchMedia('(max-width: 600px)'). Resize your browser to see it snap to showing 0 siblings (only First, Last, Current).
        </p>
      </section>

    </div>
  `
})
class PaginationStoryComponent {
  page1 = signal(1);
  page2 = signal(10);
  page3 = signal(50);
  page4 = signal(20);
}

const meta: Meta<Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
};
export default meta;

export const Showcase: StoryObj<Pagination> = {
  render: () => ({
    moduleMetadata: {
      imports: [PaginationStoryComponent],
    },
    template: `<app-pagination-story />`,
  }),
};
