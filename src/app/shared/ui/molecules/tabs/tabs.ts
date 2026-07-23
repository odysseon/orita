import { Component, effect, inject, input, model, OnInit } from '@angular/core';
import { TabsContext } from './tabs-context';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [TabsContext],
  host: {
    '[class.app-tabs-root]': 'true',
  },
})
export class Tabs implements OnInit {
  /** Two-way bindable active tab value. */
  value = model<string | undefined>(undefined);
  
  /** Uncontrolled initial tab value. */
  defaultValue = input<string | undefined>(undefined);

  private context = inject(TabsContext);

  constructor() {
    // Sync model -> context
    effect(() => {
      const v = this.value();
      if (v !== undefined) {
        this.context.select(v);
      }
    }, { allowSignalWrites: true });

    // Sync context -> model
    effect(() => {
      const ctxV = this.context.value();
      if (ctxV !== undefined && ctxV !== this.value()) {
        this.value.set(ctxV);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Seed uncontrolled initial value
    if (this.defaultValue() !== undefined && this.value() === undefined) {
      this.context.select(this.defaultValue()!);
    }
  }
}
