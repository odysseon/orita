import { Component, Directive, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    ui-list {
      display: flex;
      flex-direction: column;
      background: var(--surface-default);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }
    
    .ui-list-item {
      display: flex;
      align-items: center;
      width: 100%;
      text-align: left;
      padding: var(--size-16);
      background: transparent;
      border: none;
      text-decoration: none;
      color: inherit;
      transition: background-color var(--transition-fast) ease;
      gap: var(--size-16);
      font-family: inherit;
    }

    button.ui-list-item,
    a.ui-list-item {
      cursor: pointer;
    }

    button.ui-list-item:hover,
    a.ui-list-item:hover {
      background: var(--surface-container);
    }
    
    button.ui-list-item:active,
    a.ui-list-item:active {
      background: var(--surface-container-high);
    }

    .ui-list-item + .ui-list-item {
      border-top: 1px solid var(--border-subtle);
    }

    .ui-list-item-start {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ui-list-item-content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: var(--size-2);
      min-width: 0; /* allows text truncation */
    }

    .ui-list-item-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      line-height: var(--line-height-tight);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui-list-item-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui-list-item-end {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--text-tertiary);
    }
  `]
})
export class List {}

@Directive({
  selector: '[uiListItem]',
  standalone: true,
  host: { 'class': 'ui-list-item' }
})
export class ListItem {}

@Directive({
  selector: '[uiListItemStart]',
  standalone: true,
  host: { 'class': 'ui-list-item-start' }
})
export class ListItemStart {}

@Directive({
  selector: '[uiListItemContent]',
  standalone: true,
  host: { 'class': 'ui-list-item-content' }
})
export class ListItemContent {}

@Directive({
  selector: '[uiListItemTitle]',
  standalone: true,
  host: { 'class': 'ui-list-item-title' }
})
export class ListItemTitle {}

@Directive({
  selector: '[uiListItemDescription]',
  standalone: true,
  host: { 'class': 'ui-list-item-description' }
})
export class ListItemDescription {}

@Directive({
  selector: '[uiListItemEnd]',
  standalone: true,
  host: { 'class': 'ui-list-item-end' }
})
export class ListItemEnd {}
