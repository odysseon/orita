import { Component, computed, input, output } from '@angular/core';

export type NavItemLayout = 'vertical' | 'horizontal';
export type NavItemIconSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-nav-item',
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.css',
  host: {
    '[class.active]': 'active()',
    '[class.nav-item-vertical]': 'layout() === "vertical"',
    '[class.nav-item-horizontal]': 'layout() === "horizontal"',
    '[class.nav-item-disabled]': 'disabled()',
    '[class.nav-item-icon-sm]': 'iconSize() === "sm"',
    '[class.nav-item-icon-md]': 'iconSize() === "md"',
    '[class.nav-item-icon-lg]': 'iconSize() === "lg"',
  },
})
export class NavItem {
  active = input<boolean>(false);
  layout = input<NavItemLayout>('vertical');
  disabled = input<boolean>(false);
  iconSize = input<NavItemIconSize>('md');

  clicked = output<void>();
}
