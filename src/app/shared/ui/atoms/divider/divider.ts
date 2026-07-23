import { Component, input, computed, ViewEncapsulation } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerType = 'solid' | 'dashed' | 'dotted';

@Component({
  selector: 'hr[app-divider], div[app-divider], app-divider',
  standalone: true,
  templateUrl: './divider.html',
  styleUrl: './divider.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation() === "vertical" ? "vertical" : null',
  }
})
export class Divider {
  orientation = input<DividerOrientation>('horizontal');
  type = input<DividerType>('solid');

  classes = computed(() => {
    return `divider divider--${this.orientation()} divider--${this.type()}`;
  });
}
