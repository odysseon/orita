import { Injectable, signal, computed, effect } from '@angular/core';

export interface ComboboxOptionState {
  id: string;
  value: any;
  element: HTMLElement;
  disabled?: boolean;
}

@Injectable()
export class ComboboxContext {
  readonly activeDescendant = signal<string | null>(null);
  readonly selectedValue = signal<any | null>(null);
  
  readonly options = signal<ComboboxOptionState[]>([]);

  registerOption(option: ComboboxOptionState) {
    this.options.update(opts => {
      const newOpts = [...opts, option];
      // If this is the first option being added and nothing is active, make it active
      if (newOpts.length === 1 && !this.activeDescendant()) {
        setTimeout(() => this.activeDescendant.set(option.id), 0);
      }
      return newOpts;
    });
  }

  unregisterOption(id: string) {
    this.options.update(opts => {
      const newOpts = opts.filter(o => o.id !== id);
      if (this.activeDescendant() === id) {
        // If the active item was removed, fallback to the first available or null
        setTimeout(() => this.activeDescendant.set(newOpts.length > 0 ? newOpts[0].id : null), 0);
      }
      return newOpts;
    });
  }

  moveActive(direction: 1 | -1) {
    const opts = this.options().filter(o => !o.disabled);
    if (!opts.length) return;

    const currentIdx = opts.findIndex(o => o.id === this.activeDescendant());
    let nextIdx = currentIdx + direction;

    if (nextIdx < 0) nextIdx = opts.length - 1;
    if (nextIdx >= opts.length) nextIdx = 0;

    this.activeDescendant.set(opts[nextIdx].id);
    opts[nextIdx].element.scrollIntoView({ block: 'nearest' });
  }

  selectActive() {
    const activeId = this.activeDescendant();
    if (activeId) {
      const opt = this.options().find(o => o.id === activeId);
      if (opt && !opt.disabled) {
        this.selectedValue.set(opt.value);
      }
    }
  }
}
