import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class DrawerFocusService {
  private document = inject(DOCUMENT);
  private lastFocusedElement: HTMLElement | null = null;

  remember(): void {
    const active = this.document.activeElement;
    this.lastFocusedElement = active instanceof HTMLElement ? active : null;
  }

  restore(): void {
    this.lastFocusedElement?.focus();
    this.lastFocusedElement = null;
  }

  trapFocus(panel: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => {
      // Exclude elements that are visually hidden but still in DOM
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    });

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (this.document.activeElement === first || this.document.activeElement === panel) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (this.document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }
}
