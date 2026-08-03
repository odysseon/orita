import { Component, input, ViewEncapsulation } from '@angular/core';
import { Card, CardAppearance } from '../../../atoms/card/card';
import { Skeleton } from '../../../atoms/skeleton/skeleton';

@Component({
  selector: 'ui-post-card-skeleton',
  standalone: true,
  imports: [Card, Skeleton],
  template: `
    <app-card 
      class="post-card" 
      [appearance]="appearance()" 
      [padding]="appearance() === 'plain' ? 'none' : 'md'" 
      [radius]="appearance() === 'plain' ? 'none' : 'lg'"
      style="width: 100%;"
    >
      <div class="post-card__avatar">
        <app-skeleton shape="circle" style="width: 100%; height: 100%;"></app-skeleton>
      </div>
      <div class="post-card__content">
        <header class="post-card__header">
          <app-skeleton shape="text" style="width: 40%; height: 15px;"></app-skeleton>
        </header>
        <div class="post-card__body">
          <app-skeleton shape="text" style="width: 90%; height: 14px; margin-top: 8px;"></app-skeleton>
          <app-skeleton shape="text" style="width: 60%; height: 14px; margin-top: 4px;"></app-skeleton>
        </div>
      </div>
    </app-card>
  `,
  styleUrls: ['./post-card.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PostCardSkeleton {
  appearance = input<CardAppearance>('filled');
}
