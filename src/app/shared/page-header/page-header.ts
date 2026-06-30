import { Component, input, output } from '@angular/core';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-page-header',
  imports: [LucideArrowLeft],
  template: `
    <header class="page-header">
      <button class="btn-back" (click)="back.emit()" type="button" aria-label="Go back">
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
  readonly title = input<string>();
  readonly backText = input<string>();
  readonly back = output<void>();
}
