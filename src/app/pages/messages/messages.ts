import { Component } from '@angular/core';
import { LucideMessageCircle } from '@lucide/angular';
import { AppHeader } from '../../shared/app-header/app-header';

@Component({
  selector: 'app-messages-page',
  imports: [AppHeader, LucideMessageCircle],
  template: `
    <ui-app-header pageTitle="Messages" [showLogo]="false"></ui-app-header>
    <div class="empty-state-wrapper">
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg lucideMessageCircle aria-hidden="true" style="width: 40px; height: 40px;"></svg>
        </div>
        <h2 class="empty-state__title">Connect with Locals</h2>
        <p class="empty-state__desc">
          Get ready to chat directly with businesses, tour guides, and other locals. We're building a seamless messaging experience just for you.
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
export class MessagesPage {}
