import { Component, computed, inject, input } from '@angular/core';
import { TabsContext } from './tabs-context';

@Component({
  selector: 'ui-tab-panel',
  standalone: true,
  template: `
    @if (isActive()) {
      <ng-content></ng-content>
    }
  `,
  host: {
    'role': 'tabpanel',
    '[attr.id]': 'panelId()',
    '[attr.aria-labelledby]': 'triggerId()',
    // Always hide the host block if not active, or just let @if destroy the content
    '[hidden]': '!isActive()',
  },
})
export class TabPanel {
  value = input.required<string>();

  context = inject(TabsContext);

  isActive = computed(() => this.context.value() === this.value());
  panelId = computed(() => `${this.context.tabsId}-panel-${this.value()}`);
  triggerId = computed(() => `${this.context.tabsId}-trigger-${this.value()}`);
}
