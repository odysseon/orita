import { Component, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-listing-form',
  imports: [LucideX],
  template: `
    <div class="listing-form-card">
      <div class="listing-form-card__header">
        <span class="listing-form-card__title">New listing</span>
        <button
          class="listing-form-card__close"
          type="button"
          aria-label="Close form"
          (click)="closeForm.emit()"
        >
          <svg lucideX aria-hidden="true"></svg>
        </button>
      </div>
      <ng-content />
    </div>
  `,
  styleUrl: './listing-form.css',
})
export class AppListingForm {
  readonly closeForm = output<void>();
}
