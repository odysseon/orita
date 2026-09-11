import { Component, input, output, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from 'ur-ui';
import { Button } from 'ur-ui';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Button, LucideArrowLeft],
  template: `
    <ui-header [sticky]="sticky()" [uiScrollHide]="uiScrollHide()" [scrollHidePosition]="scrollHidePosition()">
      <ng-container uiHeaderStart>
        @if (back()) {
          <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Go Back" (click)="goBack()">
            <svg lucideArrowLeft></svg>
          </button>
        }
        <ng-content select="[pageHeaderStart]"></ng-content>
      </ng-container>
      <ng-container uiHeaderCenter>
        @if (title()) {
          <span class="page-title">{{ title() }}</span>
        }
        <ng-content select="[pageHeaderCenter]"></ng-content>
      </ng-container>
      <ng-container uiHeaderEnd>
        <ng-content select="[pageHeaderEnd]"></ng-content>
      </ng-container>
    </ui-header>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .page-title {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-md);
      color: var(--text-primary);
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
  private router = inject(Router);

  customBack = input<boolean>(false);
  backAction = output<void>();

  goBack() {
    if (this.customBack()) {
      this.backAction.emit();
      return;
    }
    
    const navId = history.state?.navigationId ?? 1;
    if (navId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
