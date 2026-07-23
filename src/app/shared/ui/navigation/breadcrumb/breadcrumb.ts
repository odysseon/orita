import { Component, effect, input, signal, output, contentChildren, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-breadcrumb-item',
  standalone: true,
  imports: [RouterLink, LucideChevronRight],
  host: {
    '[class.app-breadcrumb-item]': 'true',
  },
  template: `
    @if (isLast()) {
      <span class="breadcrumb-current" aria-current="page">
        <ng-content></ng-content>
      </span>
    } @else {
      @if (routerLink()) {
        <a class="breadcrumb-link" [routerLink]="routerLink()">
          <ng-content></ng-content>
        </a>
      } @else if (href()) {
        <a class="breadcrumb-link" [href]="href()">
          <ng-content></ng-content>
        </a>
      } @else {
        <span class="breadcrumb-link breadcrumb-link--button" tabindex="0" role="button" (click)="action.emit($event)" (keydown.enter)="action.emit($event)" (keydown.space)="action.emit($event)">
          <ng-content></ng-content>
        </span>
      }
      
      <span class="breadcrumb-separator" aria-hidden="true">
        @if (separator() === 'slash') { 
          <span class="sep-text">/</span>
        }
        @else if (separator() === 'dot') { 
          <span class="sep-text">•</span>
        }
        @else { 
          <svg lucideChevronRight class="sep-icon"></svg> 
        }
      </span>
    }
  `
})
export class BreadcrumbItem {
  href = input<string>();
  routerLink = input<string | any[]>();
  action = output<Event>();

  isLast = signal(false);
  separator = signal<'slash' | 'chevron' | 'dot'>('chevron');
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  styleUrl: './breadcrumb.css',
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="breadcrumb" [class]="'app-breadcrumb app-breadcrumb--size-' + size()">
      <ng-content></ng-content>
    </nav>
  `
})
export class Breadcrumb {
  separator = input<'slash' | 'chevron' | 'dot'>('chevron');
  size = input<'sm' | 'md'>('md');

  items = contentChildren(BreadcrumbItem, { descendants: true });

  constructor() {
    effect(() => {
      const itemsList = this.items();
      const sep = this.separator();
      itemsList.forEach((item, i) => {
        item.isLast.set(i === itemsList.length - 1);
        item.separator.set(sep);
      });
    });
  }
}
