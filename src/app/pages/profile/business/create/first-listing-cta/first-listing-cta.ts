import { Component, output } from '@angular/core';

import { LucidePartyPopper } from '@lucide/angular';
import { Button } from '../../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-first-listing-cta',
  standalone: true,
  imports: [LucidePartyPopper, Button],
  templateUrl: './first-listing-cta.html',
  styleUrl: './first-listing-cta.css',
})
export class FirstListingCta {
  readonly createListing = output<void>();
  readonly dismiss = output<void>();
}
