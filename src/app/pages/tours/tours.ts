import { Component } from '@angular/core';
import { LucideCompass } from '@lucide/angular';
import { AppHeader } from '../../shared/app-header/app-header';

@Component({
  selector: 'app-tours-page',
  imports: [AppHeader, LucideCompass],
  template: `
    <ui-app-header pageTitle="Tours" [showLogo]="false"></ui-app-header>
    <div class="empty-state-wrapper">
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg lucideCompass aria-hidden="true" style="width: 40px; height: 40px;"></svg>
        </div>
        <h2 class="empty-state__title">Discover Local Tours</h2>
        <p class="empty-state__desc">
          We're brewing up something amazing. Soon, you'll be able to explore, book, and experience unforgettable local tours right from here. Stay tuned!
        </p>
      </div>
    </div>
  `,
  styles: [`
    .empty-state-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - var(--app-header-height) - var(--nav-height, 0px));
      padding: var(--size-24);
    }
    .empty-state {
      text-align: center;
      max-width: 400px;
    }
    .empty-state__icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--size-24);
      background: var(--surface-2);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }
    .empty-state__icon svg {
      width: 40px;
      height: 40px;
    }
    .empty-state__title {
      font-size: var(--size-24);
      font-weight: 700;
      color: var(--text-1);
      margin-bottom: var(--size-12);
    }
    .empty-state__desc {
      font-size: var(--size-16);
      color: var(--text-2);
      line-height: 1.5;
    }
  `],
})
export class ToursPage {}
