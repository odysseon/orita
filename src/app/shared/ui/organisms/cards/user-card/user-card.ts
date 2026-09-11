import { Component, input, ViewEncapsulation } from '@angular/core';
import { UserIdentity } from '../../../identity/user-identity/user-identity';

import { Card } from 'ur-ui';

@Component({
  selector: 'ui-user-card',
  standalone: true,
  imports: [UserIdentity, Card],
  template: `
    <app-card appearance="plain" [interactive]="true" class="ui-user-card-container">
      <div class="ui-user-card__header">
        <div class="ui-user-card__identity-wrapper">
          <ui-user-identity [user]="user()"></ui-user-identity>
        </div>
        <div class="ui-user-card__actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      @if (bio()) {
        <div class="ui-user-card__bio truncate-2">{{ bio() }}</div>
      }
    </app-card>
  `,
  styleUrl: './user-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-user-card]': 'true'
  }
})
export class UserCard {
  user = input.required<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
  }>();
  
  bio = input<string | null | undefined>(null);
}
