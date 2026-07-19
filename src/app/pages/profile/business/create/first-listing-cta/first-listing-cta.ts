import { Component, output } from '@angular/core';

import { LucidePartyPopper } from '@lucide/angular';

@Component({
  selector: 'app-first-listing-cta',
  standalone: true,
  imports: [LucidePartyPopper],
  templateUrl: './first-listing-cta.html',
  styleUrl: './first-listing-cta.css',
})
export class FirstListingCta {
  readonly createListing = output<void>();
  readonly dismiss = output<void>();
}
