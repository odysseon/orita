import {
  Component,
  Directive,
  ElementRef,
  contentChildren,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DropdownTrigger } from '../dropdown/dropdown';

@Directive({
  selector: 'button[app-menu-item], a[app-menu-item]',
  standalone: true,
  host: {
    'role': 'menuitem',
    '[class.app-menu-item]': 'true',
    '[class.app-menu-item--danger]': 'intent() === "danger"',
    '[attr.tabindex]': '-1',
    '[attr.disabled]': 'disabled() ? true : null',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class MenuItem {
  intent = input<'neutral' | 'danger'>('neutral');
  disabled = input<boolean>(false);

  el = inject(ElementRef<HTMLElement>);
  // Trigger injected optionally, allows Menus to be used standalone (e.g. static sidebar)
  trigger = inject(DropdownTrigger, { optional: true });

  onClick() {
    if (!this.disabled()) {
      this.trigger?.close();
      this.trigger?.focus();
    }
  }

  onMouseEnter() {
    if (!this.disabled()) {
      this.el.nativeElement.focus();
    }
  }
}

@Directive({
  selector: 'app-menu-separator, hr[app-menu-separator]',
  standalone: true,
  host: {
    'role': 'separator',
    '[class.app-menu-separator]': 'true',
  },
})
export class MenuSeparator {}

@Component({
  selector: 'app-menu',
  standalone: true,
  styleUrl: './menu.css',
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'menu',
    '[class.app-menu]': 'true',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Menu {
  items = contentChildren(MenuItem, { descendants: true });

  private searchString = '';
  private searchTimeout: any;

  onKeydown(e: KeyboardEvent) {
    const activeItems = this.items().filter((i) => !i.disabled());
    if (!activeItems.length) return;

    const currentIdx = activeItems.findIndex((i) => i.el.nativeElement === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = currentIdx === -1 ? 0 : (currentIdx + 1) % activeItems.length;
      activeItems[next].el.nativeElement.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = currentIdx === -1 ? activeItems.length - 1 : (currentIdx - 1 + activeItems.length) % activeItems.length;
      activeItems[next].el.nativeElement.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      activeItems[0].el.nativeElement.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      activeItems[activeItems.length - 1].el.nativeElement.focus();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Typeahead logic
      this.searchString += e.key.toLowerCase();
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchString = '';
      }, 500);

      const match = activeItems.find((i) => {
        const text = i.el.nativeElement.textContent?.trim().toLowerCase() || '';
        return text.startsWith(this.searchString);
      });

      if (match) {
        match.el.nativeElement.focus();
      }
    }
  }
}
