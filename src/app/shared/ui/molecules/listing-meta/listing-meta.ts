import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ui-listing-meta',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <span class="ui-listing-meta__price">
      {{ price() ?? 0 | currency: 'NGN' : 'symbol-narrow' : '1.0-0' }}
    </span>
    @if (availability()) {
      <span class="ui-listing-meta__status" [attr.data-availability]="availability()">
        {{ availabilityLabel() }}
      </span>
    }
  `,
  styleUrl: './listing-meta.css',
  encapsulation: ViewEncapsulation.None,
  host: { '[class.ui-listing-meta]': 'true' },
})
export class ListingMeta {
  price = input<number | undefined>();
  availability = input<string | undefined>();

  availabilityLabel = computed(() => {
    switch (this.availability()) {
      case 'IN_STOCK':
        return 'In Stock';
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      case 'PRE_ORDER':
        return 'Pre-order';
      default:
        return '';
    }
  });
}
