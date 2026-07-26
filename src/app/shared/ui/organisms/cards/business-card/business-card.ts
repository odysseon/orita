import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';
import { FollowButton } from '../../../actions/follow-button/follow-button';
import { ShareButton } from '../../../../share-button/share-button';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { Card } from '../../../atoms/card/card';

@Component({
  selector: 'ui-business-card',
  standalone: true,
  imports: [BusinessIdentity, FollowButton, ShareButton, CoverMedia, Card],
  template: `
    <app-card appearance="plain" [interactive]="true" padding="none" class="ui-business-card-container">
      @if (coverUrl()) {
        <div class="ui-business-card__cover">
          <ui-cover-media [src]="coverUrl()">
            <ng-content select="[card-media-overlay]"></ng-content>
          </ui-cover-media>
        </div>
      }
      <div class="ui-business-card__body">
        <div class="ui-business-card__top-row" style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--size-8);">
          <div style="flex-grow: 1; min-width: 0;">
            <ui-business-identity [business]="business()"></ui-business-identity>
          </div>
          <div style="display: flex; align-items: center; gap: var(--size-4); flex-shrink: 0;">
            @if (showFollow()) {
              <div (click)="$event.stopPropagation()">
                <ui-follow-button [isFollowed]="business().isFollowed ?? false" size="sm" (toggle)="followToggle.emit(business())"></ui-follow-button>
              </div>
            }
            @if (showShare()) {
              <div (click)="$event.stopPropagation()">
                <app-share-button [title]="business().name" [text]="'Check out ' + business().name + ' on Orita'" [url]="getShareUrl()" variant="icon" size="sm" />
              </div>
            }
          </div>
        </div>
        
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
    isFollowed?: boolean;
    profileUrl?: any[] | string | null;
  }>();

  coverUrl = input<string | null | undefined>(null);
  showFollow = input<boolean>(true);
  showShare = input<boolean>(true);

  followToggle = output<any>();

  getShareUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/b/${this.business().slug ?? this.business().id}`;
    }
    return `/b/${this.business().slug ?? this.business().id}`;
  }
}
