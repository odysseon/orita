import { Component, output } from '@angular/core';

@Component({
  selector: 'app-first-listing-cta',
  standalone: true,
  templateUrl: './first-listing-cta.html',
  styleUrl: './first-listing-cta.css',
})
export class FirstListingCta {
  readonly createListing = output<void>();
  readonly dismiss = output<void>();
}
