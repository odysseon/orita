import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { Avatar, AvatarSize, AvatarShape } from '../../../atoms/avatar/avatar';

@Component({
  selector: 'ui-listing-identity',
  standalone: true,
  imports: [Avatar],
  template: `
    <app-avatar
      [src]="listing().imageUrl || null"
      [alt]="listing().title"
      [fallback]="listing().title.charAt(0)"
      [size]="avatarSize()"
      [shape]="avatarShape()"
    ></app-avatar>
    <div class="ui-listing-identity-info">
      <div class="ui-listing-identity-title">{{ listing().title }}</div>
      @if (showPrice() && listing().price) {
        <div class="ui-listing-identity-price">{{ listing().price }}</div>
      }
    </div>
  `,
  styleUrl: './listing-identity.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()'
  }
})
export class ListingIdentity {
  listing = input.required<{
    id: string;
    title: string;
    imageUrl?: string | null;
    price?: string | null;
  }>();

  size = input<'sm' | 'md' | 'lg'>('md');
  showPrice = input<boolean>(true);

  avatarSize = computed<AvatarSize>(() => {
    switch (this.size()) {
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
    }
  });

  avatarShape = computed<AvatarShape>(() => 'rounded');

  classes = computed(() => {
    return `ui-listing-identity ui-listing-identity--${this.size()}`;
  });
}
