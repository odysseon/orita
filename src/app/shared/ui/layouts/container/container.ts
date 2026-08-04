import { Component, input } from '@angular/core';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'fluid';

@Component({
  selector: 'ui-container',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: var(--size-16);
      padding-right: var(--size-16);
    }
    :host([data-size="sm"]) { max-width: 40rem; }
    :host([data-size="md"]) { max-width: 48rem; }
    :host([data-size="lg"]) { max-width: 64rem; }
    :host([data-size="fluid"]) { max-width: 100%; }

    @media (min-width: 48rem) {
      :host {
        padding-left: var(--size-24);
        padding-right: var(--size-24);
      }
    }
  `],
  host: {
    '[attr.data-size]': 'size()'
  }
})
export class Container {
  readonly size = input<ContainerSize>('md');
}
