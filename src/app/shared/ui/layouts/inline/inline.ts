import { Component, input } from '@angular/core';

export type InlineGap = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InlineAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type InlineJustify = 'start' | 'center' | 'end' | 'between' | 'around';

@Component({
  selector: 'ui-inline',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    :host([data-wrap="false"]) { flex-wrap: nowrap; }
    
    :host([data-gap="0"]) { gap: 0; }
    :host([data-gap="xs"]) { gap: var(--size-4); }
    :host([data-gap="sm"]) { gap: var(--size-8); }
    :host([data-gap="md"]) { gap: var(--size-16); }
    :host([data-gap="lg"]) { gap: var(--size-24); }
    :host([data-gap="xl"]) { gap: var(--size-32); }

    :host([data-align="start"]) { align-items: flex-start; }
    :host([data-align="center"]) { align-items: center; }
    :host([data-align="end"]) { align-items: flex-end; }
    :host([data-align="stretch"]) { align-items: stretch; }
    :host([data-align="baseline"]) { align-items: baseline; }

    :host([data-justify="start"]) { justify-content: flex-start; }
    :host([data-justify="center"]) { justify-content: center; }
    :host([data-justify="end"]) { justify-content: flex-end; }
    :host([data-justify="between"]) { justify-content: space-between; }
    :host([data-justify="around"]) { justify-content: space-around; }
  `],
  host: {
    '[attr.data-gap]': 'gap()',
    '[attr.data-align]': 'align()',
    '[attr.data-justify]': 'justify()',
    '[attr.data-wrap]': 'wrap()'
  }
})
export class Inline {
  readonly gap = input<InlineGap>('md');
  readonly align = input<InlineAlign>('center');
  readonly justify = input<InlineJustify>('start');
  readonly wrap = input<boolean>(true);
}
