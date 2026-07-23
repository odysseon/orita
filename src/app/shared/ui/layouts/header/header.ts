import { Component, Directive, input } from '@angular/core';

@Directive({
  selector: '[uiHeaderStart]',
  standalone: true
})
export class HeaderStart {}

@Directive({
  selector: '[uiHeaderCenter]',
  standalone: true
})
export class HeaderCenter {}

@Directive({
  selector: '[uiHeaderEnd]',
  standalone: true
})
export class HeaderEnd {}

@Component({
  selector: 'ui-header',
  standalone: true,
  template: `
    <div class="ui-header-start"><ng-content select="[uiHeaderStart]"></ng-content></div>
    <div class="ui-header-center"><ng-content select="[uiHeaderCenter]"></ng-content></div>
    <div class="ui-header-end"><ng-content select="[uiHeaderEnd]"></ng-content></div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: var(--size-56);
      padding: var(--size-8) var(--size-16);
      background: var(--surface-default);
      width: 100%;
      z-index: 10;
    }
    :host([data-sticky="true"]) {
      position: sticky;
      top: 0;
    }
    :host([data-bordered="true"]) {
      border-bottom: 1px solid var(--border-subtle);
    }
    .ui-header-start, .ui-header-end {
      display: flex;
      align-items: center;
      flex: 1;
      gap: var(--size-8);
    }
    .ui-header-end {
      justify-content: flex-end;
    }
    .ui-header-center {
      display: flex;
      justify-content: center;
      flex: 2;
      text-align: center;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-md);
      color: var(--text-primary);
    }
  `],
  host: {
    '[attr.data-sticky]': 'sticky()',
    '[attr.data-bordered]': 'bordered()'
  }
})
export class Header {
  readonly sticky = input<boolean>(false);
  readonly bordered = input<boolean>(true);
}
