import { Component, input, computed } from '@angular/core';

export type GridGap = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-grid',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: grid;
      /* Default to 1 column */
      grid-template-columns: repeat(var(--grid-cols, 1), minmax(0, 1fr));
    }
    :host([data-gap="0"]) { gap: 0; }
    :host([data-gap="xs"]) { gap: var(--size-4); }
    :host([data-gap="sm"]) { gap: var(--size-8); }
    :host([data-gap="md"]) { gap: var(--size-16); }
    :host([data-gap="lg"]) { gap: var(--size-24); }
    :host([data-gap="xl"]) { gap: var(--size-32); }

    @media (min-width: 768px) {
      :host {
        grid-template-columns: repeat(var(--grid-cols-md, var(--grid-cols, 1)), minmax(0, 1fr));
      }
    }

    @media (min-width: 1024px) {
      :host {
        grid-template-columns: repeat(var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols, 1))), minmax(0, 1fr));
      }
    }
  `],
  host: {
    '[attr.data-gap]': 'gap()',
    '[style.--grid-cols]': 'baseCols()',
    '[style.--grid-cols-md]': 'mdCols()',
    '[style.--grid-cols-lg]': 'lgCols()'
  }
})
export class Grid {
  readonly gap = input<GridGap>('md');
  /**
   * Accepts a number (e.g., `3`) or a responsive string (e.g., `'1 md:2 lg:3'`).
   */
  readonly cols = input<string | number>('1');

  baseCols = computed(() => this.parseCols('base'));
  mdCols = computed(() => this.parseCols('md'));
  lgCols = computed(() => this.parseCols('lg'));

  private parseCols(breakpoint: 'base' | 'md' | 'lg'): number | null {
    const val = this.cols();
    if (typeof val === 'number') {
      return breakpoint === 'base' ? val : null;
    }
    if (!val) return breakpoint === 'base' ? 1 : null;

    const parts = val.split(' ');
    
    // First find explicit breakpoint values
    for (const part of parts) {
      if (breakpoint === 'base' && !part.includes(':')) {
        return parseInt(part, 10) || 1;
      }
      if (breakpoint === 'md' && part.startsWith('md:')) {
        return parseInt(part.split(':')[1], 10) || null;
      }
      if (breakpoint === 'lg' && part.startsWith('lg:')) {
        return parseInt(part.split(':')[1], 10) || null;
      }
    }
    return null;
  }
}
