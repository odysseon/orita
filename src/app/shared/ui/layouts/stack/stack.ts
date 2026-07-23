import { Component, input } from '@angular/core';

export type StackGap = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

@Component({
  selector: 'ui-stack',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
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

    :host([data-justify="start"]) { justify-content: flex-start; }
    :host([data-justify="center"]) { justify-content: center; }
    :host([data-justify="end"]) { justify-content: flex-end; }
    :host([data-justify="between"]) { justify-content: space-between; }
    :host([data-justify="around"]) { justify-content: space-around; }
  `],
  host: {
    '[attr.data-gap]': 'gap()',
    '[attr.data-align]': 'align()',
    '[attr.data-justify]': 'justify()'
  }
})
export class Stack {
  readonly gap = input<StackGap>('md');
  readonly align = input<StackAlign>('stretch');
  readonly justify = input<StackJustify>('start');
}
