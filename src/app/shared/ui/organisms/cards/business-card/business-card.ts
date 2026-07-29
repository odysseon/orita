import { Component, input, output, inject, signal, ViewEncapsulation } from '@angular/core';
import { BusinessIdentity } from '../../../identity/business-identity/business-identity';
import { FollowButton } from '../../../actions/follow-button/follow-button';
import { ShareButton } from '../../../actions/share-button/share-button';
import { ShareModalComponent } from '../../share-modal/share-modal';
import { CoverMedia } from '../../../surfaces/cover-media/cover-media';
import { RouterLink } from '@angular/router';
import { Avatar } from '../../../identity/avatar/avatar';
import { LucideCheckCircle } from '@lucide/angular';
import { Card } from '../../../atoms/card/card';

@Component({
  selector: 'ui-business-card',
  standalone: true,
  imports: [FollowButton, ShareButton, ShareModalComponent, CoverMedia, Card, RouterLink, Avatar, LucideCheckCircle],
  template: `
    <a [routerLink]="['/b', business().slug || business().id]" style="text-decoration: none; color: inherit; display: block;">
      <app-card appearance="plain" [interactive]="true" padding="none" class="ui-business-card-container">
        <ui-cover-media [src]="coverUrl()" aspectRatio="4/3" [overlayGradient]="true"></ui-cover-media>
        <div class="ui-business-card__body">
          <div class="ui-business-card__identity-header" style="width: 100%; display: flex; align-items: center; gap: var(--size-12);">
            <app-avatar
              [src]="business().logoUrl"
              [alt]="business().name"
              [fallback]="business().name.charAt(0).toUpperCase()"
              size="md"
              shape="rounded"
            ></app-avatar>
            <div style="flex: 1; min-width: 0;">
              <div class="truncate" style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-md);">
                {{ business().name }}
                @if (business().isVerified) {
                  <svg lucideCheckCircle style="width: 14px; height: 14px; color: var(--clr-primary); margin-left: 4px; vertical-align: middle;" aria-hidden="true"></svg>
                }
              </div>
              @if (business().category) {
                <div class="truncate" style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                  {{ business().category }}
                </div>
              }
            </div>
          </div>

        <div class="ui-business-card__actions" style="display: flex; align-items: center; justify-content: space-between; gap: var(--size-8); margin-top: var(--size-8); padding-top: var(--size-8); border-top: 1px solid var(--border-subtle);">
          <div style="flex: 1; display: flex; align-items: center; gap: var(--size-8);" (click)="$event.preventDefault(); $event.stopPropagation()">
            @if (showFollow()) {
              <ui-follow-button
                [isFollowed]="business().isFollowed ?? false"
                [fullWidth]="true"
                size="sm"
                (toggle)="followToggle.emit($event)">
              </ui-follow-button>
            }
          </div>
          @if (showShare()) {
            <div (click)="$event.stopPropagation(); $event.preventDefault()" style="flex-shrink: 0;">
              <ui-share-button size="sm" (share)="showShareModal.set(true)" />
            </div>
          }
        </div>
        </div>
      </app-card>
    </a>

    @if (showShare()) {
      <ui-share-modal
        [isOpen]="showShareModal()"
        (close)="showShareModal.set(false)"
        embedType="BUSINESS"
        [targetId]="business().id"
        [targetSlug]="business().slug || undefined"
        [title]="business().name"
        [imageUrl]="business().logoUrl || undefined"
      />
    }
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

  /** Emits `true` if user wants to follow, `false` to unfollow */
  followToggle = output<boolean>();

  readonly showShareModal = signal(false);
}
