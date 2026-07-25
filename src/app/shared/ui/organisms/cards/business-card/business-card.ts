import { Component, input, ViewEncapsulation } from '@angular/core';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';

import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';

@Component({
  selector: 'ui-business-card',
  standalone: true,
  imports: [BusinessIdentity, CoverMedia, Card],
  template: `
    <app-card appearance="plain" [interactive]="true" padding="none" class="ui-business-card-container">
      @if (coverUrl()) {
        <div class="ui-business-card__cover">
          <ui-cover-media [src]="coverUrl()"></ui-cover-media>
        </div>
      }
      <div class="ui-business-card__body">
        <ui-business-identity [business]="business()"></ui-business-identity>
        
        <div class="ui-business-card__content">
          <ng-content select="[card-description]"></ng-content>
        </div>
        
        <div class="ui-business-card__footer">
          <ng-content select="[card-stats]"></ng-content>
        </div>
        
        <div class="ui-business-card__actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
    </app-card>
  `,
  styleUrl: './business-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-business-card]': 'true'
  }
})
export class BusinessCard {
  business = input.required<{
    id: string;
    name: string;
    slug?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    isVerified?: boolean;
    profileUrl?: any[] | string | null;
  }>();

  coverUrl = input<string | null | undefined>(null);
}
