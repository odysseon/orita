import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NavListPosition = 'bottom' | 'top' | 'side' | 'static';
export type NavListJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

@Component({
  selector: 'ui-nav-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-list.html',
  styleUrl: './nav-list.css',
  host: {
    '[class.nav-list-bottom]': 'position() === "bottom"',
    '[class.nav-list-top]': 'position() === "top"',
    '[class.nav-list-side]': 'position() === "side"',
    '[class.nav-list-static]': 'position() === "static"',
    '[class.expanded]': 'isSide() && expanded()',
    class: 'glass glass--blur',
  },
})
export class NavList {
  position = input<NavListPosition>('bottom');
  expanded = input<boolean>(true);
  justify = input<NavListJustify>('around');
  sideWidth = input<string>('280px');
  sideCollapsedWidth = input<string>('80px');

  readonly isSide = computed(() => this.position() === 'side');
}
