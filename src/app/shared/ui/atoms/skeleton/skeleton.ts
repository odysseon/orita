import { Component, input, computed, ViewEncapsulation } from '@angular/core';

export type SkeletonShape = 'rect' | 'circle' | 'text';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'aria-hidden': 'true',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  }
})
export class Skeleton {
  shape = input<SkeletonShape>('rect');
  width = input<string>();
  height = input<string>();

  classes = computed(() => {
    return `skeleton skeleton--${this.shape()}`;
  });
}
