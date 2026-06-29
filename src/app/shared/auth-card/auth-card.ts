import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-auth-card',
  imports: [RouterLink, LucideMapPin],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <header class="auth-card__header">
          <h1 class="auth-card__title">
            <svg lucideMapPin class="auth-card__icon" aria-hidden="true"></svg>
            Orita
          </h1>
          <p class="auth-card__subtitle">{{ subtitle() }}</p>
        </header>
        <div class="auth-card__body">
          <ng-content />
        </div>
        <footer class="auth-card__footer">
          {{ footerText() }}
          <a class="auth-card__footer-link" [routerLink]="footerLinkRoute()">
            {{ footerLinkLabel() }}
          </a>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './auth-card.css',
})
export class AppAuthCard {
  readonly subtitle = input.required<string>();
  readonly footerText = input.required<string>();
  readonly footerLinkLabel = input.required<string>();
  readonly footerLinkRoute = input.required<string>();
}
