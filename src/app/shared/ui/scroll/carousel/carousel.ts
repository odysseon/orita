import { Component } from '@angular/core';

@Component({
  selector: 'ui-carousel',
  standalone: true,
  template: `
    <div class="ui-carousel-scroll-area">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
    }
    .ui-carousel-scroll-area {
      display: flex;
      gap: var(--size-16);
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      padding-bottom: var(--size-8); /* Padding to prevent clipping focus rings */
      /* Padding on sides so the first/last items aren't flush to the viewport edge if Container padding is ignored */
      padding-left: var(--size-16);
      padding-right: var(--size-16);
      margin-left: calc(var(--size-16) * -1);
      margin-right: calc(var(--size-16) * -1);
    }
    
    @media (min-width: 768px) {
      .ui-carousel-scroll-area {
        padding-left: var(--size-24);
        padding-right: var(--size-24);
        margin-left: calc(var(--size-24) * -1);
        margin-right: calc(var(--size-24) * -1);
      }
    }

    .ui-carousel-scroll-area::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class Carousel {}

@Component({
  selector: 'ui-carousel-item',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
      scroll-snap-align: center;
      flex-shrink: 0;
    }
    
    @media (min-width: 768px) {
      :host {
        scroll-snap-align: start;
      }
    }
  `]
})
export class CarouselItem {}
