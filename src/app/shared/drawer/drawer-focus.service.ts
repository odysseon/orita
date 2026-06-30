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
}
