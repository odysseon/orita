import { Directive, ElementRef, HostListener, computed, inject, input } from '@angular/core';
import { TabsContext } from './tabs-context';

@Directive({
  selector: 'button[app-tab-trigger], a[app-tab-trigger]',
  standalone: true,
  host: {
    'role': 'tab',
    '[class.app-tab]': 'true',
    '[class.app-tab--active]': 'active()',
    '[attr.aria-selected]': 'active()',
    '[attr.aria-controls]': 'controlsId()',
    '[attr.id]': 'triggerId()',
    '[attr.tabindex]': 'active() ? "0" : "-1"',
    '[attr.disabled]': 'disabled() ? true : null',
  },
})
export class TabTrigger {
  value = input.required<string>();
  disabled = input<boolean>(false);

  el = inject(ElementRef<HTMLElement>);
  context = inject(TabsContext);

  active = computed(() => this.context.value() === this.value());
  triggerId = computed(() => `${this.context.tabsId}-trigger-${this.value()}`);
  controlsId = computed(() => `${this.context.tabsId}-panel-${this.value()}`);

  @HostListener('click')
  onClick() {
    if (!this.disabled()) {
      this.context.select(this.value());
    }
  }
}
