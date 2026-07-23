import { Component, input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from '../../layouts/header/header';
import { Button } from '../../atoms/button/button';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Button, LucideArrowLeft],
  template: `
    <ui-header [sticky]="sticky()" [uiScrollHide]="uiScrollHide()" [scrollHidePosition]="scrollHidePosition()">
      <div uiHeaderStart>
        @if (back()) {
          <button app-button appearance="ghost" size="icon" shape="circle" (click)="goBack()" aria-label="Go back">
            <svg lucideArrowLeft></svg>
          </button>
        }
      </div>
      <div uiHeaderCenter class="page-title">
        {{ title() }}
      </div>
      <div uiHeaderEnd>
        <ng-content></ng-content>
      </div>
    </ui-header>
  `,
  styles: [`
    .page-title {
      font-weight: 600;
      font-size: 1rem;
    }
  `]
})
export class PageHeader {
  title = input<string>('');
  back = input<boolean>(true);
  sticky = input<boolean>(false);
  uiScrollHide = input<boolean>(false);
  scrollHidePosition = input<'top' | 'bottom'>('top');

  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
