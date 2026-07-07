import { Signal } from '@angular/core';

export interface LayoutPage {
  readonly pageTitle: Signal<string | undefined>;
}

export function isLayoutPage(component: any): component is LayoutPage {
  return component && typeof component === 'object' && 'pageTitle' in component;
}
