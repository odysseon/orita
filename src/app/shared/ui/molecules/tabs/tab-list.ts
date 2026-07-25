import { Component, computed, contentChildren, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { TabsContext } from './tabs-context';
import { TabTrigger } from './tab-trigger';

@Component({
  selector: 'ui-tab-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrl: './tabs.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'tablist',
    '[class.app-tabs]': 'true',
    '[class.app-tabs--full-width]': 'fullWidth()',
    '[class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class TabList {
  appearance = input<'line' | 'pill' | 'enclosed'>('line');
  size = input<'sm' | 'md' | 'lg'>('md');
  fullWidth = input<boolean>(false);

  triggers = contentChildren(TabTrigger, { descendants: true });
  context = inject(TabsContext);

  classes = computed(() => `app-tabs--${this.appearance()} app-tabs--size-${this.size()}`);

  constructor() {
    effect(() => {
      this.context.appearance.set(this.appearance());
      this.context.size.set(this.size());
    }, { allowSignalWrites: true });
  }

  onKeydown(event: KeyboardEvent) {
    const triggerList = this.triggers().filter(t => !t.disabled());
    if (!triggerList.length) return;

    // Use context value to find active, fallback to first item
    const currentVal = this.context.value();
    let currentIdx = triggerList.findIndex((t) => t.value() === currentVal);
    if (currentIdx === -1) {
       // if focus is in here but no active item matched, just use the focused element
       currentIdx = triggerList.findIndex((t) => t.el.nativeElement === document.activeElement);
       if (currentIdx === -1) return;
    }

    let nextIdx = currentIdx;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIdx = (currentIdx + 1) % triggerList.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIdx = (currentIdx - 1 + triggerList.length) % triggerList.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = triggerList.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTrigger = triggerList[nextIdx];
    
    // Automatic activation pattern: move focus AND select it immediately.
    nextTrigger.el.nativeElement.focus();
    this.context.select(nextTrigger.value());
  }
}
