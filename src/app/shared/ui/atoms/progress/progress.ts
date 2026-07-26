import { Component, input, computed, booleanAttribute, ViewEncapsulation } from '@angular/core';

export type ProgressIntent = 'primary' | 'success' | 'warning' | 'error';
export type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-progress',
  standalone: true,
  templateUrl: './progress.html',
  styleUrl: './progress.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'role': 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'indeterminate() ? null : normalizedValue()',
  }
})
export class Progress {
  value = input<number>(0);
  indeterminate = input<boolean, unknown>(false, { transform: booleanAttribute });
  intent = input<ProgressIntent>('primary');
  size = input<ProgressSize>('md');

  normalizedValue = computed(() => {
    const val = this.value();
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  });

  classes = computed(() => {
    return [
      'progress',
      `intent-${this.intent()}`,
      `progress--${this.size()}`,
      this.indeterminate() ? 'progress--indeterminate' : ''
    ].filter(Boolean).join(' ');
  });
}
