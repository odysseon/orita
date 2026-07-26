import { Service, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Service()
export class DrawerScrollService {
  private document = inject(DOCUMENT);
  private count = 0;

  lock(): void {
    if (this.count === 0) {
      this.document.body.style.overflow = 'hidden';
    }
    this.count++;
  }

  unlock(): void {
    if (this.count <= 0) return;
    this.count--;
    if (this.count === 0) {
      this.document.body.style.overflow = '';
    }
  }
}
