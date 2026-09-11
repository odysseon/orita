import { Component, input, ViewEncapsulation } from '@angular/core';
import { Card, CardAppearance } from 'ur-ui';
import { Skeleton } from 'ur-ui';

@Component({
  selector: 'ui-post-card-skeleton',
  standalone: true,
  imports: [Card, Skeleton],
  template: `
    <app-card 
      [appearance]="appearance()" 
      [padding]="appearance() === 'plain' ? 'none' : 'md'" 
      [radius]="appearance() === 'plain' ? 'none' : 'lg'"
      style="width: 100%;"
    >
      <div class="post-card">
        <div class="post-card__avatar">
          <app-skeleton shape="circle" style="width: 100%; height: 100%;"></app-skeleton>
        </div>
        <div class="post-card__content">
          <header class="post-card__header">
            <app-skeleton shape="text" style="width: 40%; height: var(--size-15);"></app-skeleton>
          </header>
          <div class="post-card__body">
            <app-skeleton shape="text" style="width: 90%; height: var(--size-14); margin-top: var(--size-8);"></app-skeleton>
            <app-skeleton shape="text" style="width: 60%; height: var(--size-14); margin-top: var(--size-4);"></app-skeleton>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styleUrls: ['./post-card.css'],
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class PostCardSkeleton {
  appearance = input<CardAppearance>('filled');
}
