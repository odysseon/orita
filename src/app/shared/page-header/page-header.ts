import { Component, inject, input, output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-page-header',
  imports: [LucideArrowLeft],
  template: `
    <header class="page-header">
      <button class="btn-back" (click)="handleBack()" type="button" aria-label="Go back">
        <svg lucideArrowLeft aria-hidden="true"></svg>
        @if (backText()) {
          {{ backText() }}
        }
      </button>
      @if (title()) {
        <h1 class="page-header__title">{{ title() }}</h1>
      }
      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styleUrl: './page-header.css',
})
export class AppPageHeader {
  #location = inject(Location);
  #router = inject(Router);

  readonly title = input<string>();
  readonly backText = input<string>();
  readonly fallbackUrl = input<string>('/');
  
  /** Emitted BEFORE the default navigation happens. */
  readonly back = output<void>();

  handleBack(): void {
    this.back.emit();
    
    const navId = history.state?.navigationId ?? 1;
    if (navId > 1) {
      this.#location.back();
    } else {
      this.#router.navigateByUrl(this.fallbackUrl());
    }
  }
}
