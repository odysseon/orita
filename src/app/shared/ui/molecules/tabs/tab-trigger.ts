import { Directive, ElementRef, HostListener, computed, effect, inject, input } from '@angular/core';
import { TabsContext } from './tabs-context';
import { Button } from '../../atoms/button/button';

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
  button = inject(Button, { optional: true, host: true });

  active = computed(() => this.context.value() === this.value());
  triggerId = computed(() => `${this.context.tabsId}-trigger-${this.value()}`);
  controlsId = computed(() => `${this.context.tabsId}-panel-${this.value()}`);

  constructor() {
    effect(() => {
      const btn = this.button;
      if (btn) {
        btn.overrideSize.set(this.context.size());
        const app = this.context.appearance();
        const active = this.active();

        if (app === 'line') {
          btn.overrideAppearance.set('ghost');
          btn.overrideIntent.set('secondary');
        } else if (app === 'pill') {
          btn.overrideAppearance.set(active ? 'soft' : 'ghost');
          btn.overrideIntent.set(active ? 'primary' : 'secondary');
        } else if (app === 'enclosed') {
          btn.overrideAppearance.set(active ? 'solid' : 'ghost');
          btn.overrideIntent.set('secondary');
        }
      }
    });
  }

  @HostListener('click')
  onClick() {
    if (!this.disabled()) {
      this.context.select(this.value());
    }
  }
}
