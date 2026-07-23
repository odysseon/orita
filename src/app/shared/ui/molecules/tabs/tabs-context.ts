import { Injectable, signal } from '@angular/core';

let nextId = 0;

@Injectable()
export class TabsContext {
  readonly tabsId = `tabs-${nextId++}`;
  
  /** The currently active tab value. */
  readonly value = signal<string | undefined>(undefined);

  /** 
   * Selects a new tab. This is called by TabList and TabTrigger.
   * The root Tabs component listens to this signal to update its two-way bound model.
   */
  select(newValue: string) {
    this.value.set(newValue);
  }
}
