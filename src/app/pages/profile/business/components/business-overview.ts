import { Component, input, output } from '@angular/core';
import { LucideEye, LucideBookmark, LucideMousePointerClick, LucideList, LucideMapPin, LucideMail, LucidePhone, LucideGlobe } from '@lucide/angular';
import { IBusinessProfile, IDashboardStats } from '../business.interface';
import { IBusinessSummary } from '../../../home/home.interface';
import { BusinessCard } from '../../../../shared/ui/organisms/cards/business-card/business-card';
import { VisibilityScore } from '../../../../shared/visibility-score/visibility-score';
import { Skeleton } from '../../../../shared/ui/atoms/skeleton/skeleton';
import { List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription } from '../../../../shared/ui/surfaces/list/list';

@Component({
  selector: 'app-business-overview',
  standalone: true,
  imports: [
    LucideEye,
    LucideBookmark,
    LucideMousePointerClick,
    LucideList,
    LucideMapPin,
    LucideMail,
    LucidePhone,
    LucideGlobe,
    BusinessCard,
    VisibilityScore,
    Skeleton,
    List,
    ListItem,
    ListItemStart,
    ListItemContent,
    ListItemTitle,
    ListItemDescription
  ],
  template: `
  <div class="biz-section">
    <!-- Preview -->
    @if (businessSummary()) {
      <div class="panel">
        <h2 class="panel__title">Here's what customers see</h2>
        <div class="panel__body" style="padding: 0; max-width: 320px; margin: 0 auto; width: 100%;">
          <ui-business-card 
            [business]="businessSummary()!" 
            [coverUrl]="business().coverUrl"
          >
            <div card-description>{{ businessSummary()?.description }}</div>
          </ui-business-card>
        </div>
      </div>
    }

    <app-visibility-score
      [business]="business()"
      [listingCount]="stats()?.totalListings || 0"
      (actionTriggered)="visibilityAction.emit($event)"
    ></app-visibility-score>

    <!-- Stats -->
    @if (stats()) {
    <div class="biz-stats">
      <div class="biz-stat">
        <svg lucideEye class="biz-stat__icon" aria-hidden="true"></svg>
        <span class="biz-stat__value">{{ stats()!.profileViews }}</span>
        <span class="biz-stat__label">Profile views</span>
      </div>
      <div class="biz-stat">
        <svg lucideList class="biz-stat__icon" aria-hidden="true"></svg>
        <span class="biz-stat__value">{{ stats()!.totalListings }}</span>
        <span class="biz-stat__label">Listings</span>
      </div>
      <div class="biz-stat">
        <svg lucideBookmark class="biz-stat__icon" aria-hidden="true"></svg>
        <span class="biz-stat__value">{{ stats()!.totalSaves }}</span>
        <span class="biz-stat__label">Saves</span>
      </div>
      <div class="biz-stat">
        <svg lucideMousePointerClick class="biz-stat__icon" aria-hidden="true"></svg>
        <span class="biz-stat__value">{{ stats()!.totalContactClicks }}</span>
        <span class="biz-stat__label">Contact clicks</span>
      </div>
    </div>
    } @if (statsLoading()) {
    <div class="biz-stats">
      @for (i of [1,2,3,4]; track i) {
      <app-skeleton class="skeleton--stat"></app-skeleton>
      }
    </div>
    }

    <!-- Info -->
    <div class="panel">
      <h2 class="panel__title">Business details</h2>
      <div class="panel__body" style="padding: 0;">
        <ui-list [bordered]="false" [radius]="false">
          @if (business().description) {
            <div uiListItem>
              <div uiListItemContent>
                <div uiListItemTitle>About</div>
                <div uiListItemDescription style="white-space: normal;">{{ business().description }}</div>
              </div>
            </div>
          }
          <div uiListItem>
            <div uiListItemContent>
              <div uiListItemTitle>Type</div>
              <div uiListItemDescription>{{ business().businessType }}</div>
            </div>
          </div>
          @if (business().location) {
            <div uiListItem>
              <svg uiListItemStart lucideMapPin aria-hidden="true" style="width: 16px; height: 16px;"></svg>
              <div uiListItemContent>
                <div uiListItemTitle>Address</div>
                <div uiListItemDescription style="white-space: normal;">{{ business().location }}</div>
              </div>
            </div>
          }
          @if (business().contactEmail) {
            <div uiListItem>
              <svg uiListItemStart lucideMail aria-hidden="true" style="width: 16px; height: 16px;"></svg>
              <div uiListItemContent>
                <div uiListItemTitle>Email</div>
                <div uiListItemDescription>{{ business().contactEmail }}</div>
              </div>
            </div>
          }
          @if (business().contactPhone) {
            <div uiListItem>
              <svg uiListItemStart lucidePhone aria-hidden="true" style="width: 16px; height: 16px;"></svg>
              <div uiListItemContent>
                <div uiListItemTitle>Phone</div>
                <div uiListItemDescription>{{ business().contactPhone }}</div>
              </div>
            </div>
          }
          @if (business().websiteUrl) {
            <div uiListItem>
              <svg uiListItemStart lucideGlobe aria-hidden="true" style="width: 16px; height: 16px;"></svg>
              <div uiListItemContent>
                <div uiListItemTitle>Website</div>
                <div uiListItemDescription>
                  <a class="biz-info-row__link" [href]="business().websiteUrl!" target="_blank" rel="noopener noreferrer">
                    {{ business().websiteUrl }}
                  </a>
                </div>
              </div>
            </div>
          }
        </ui-list>
      </div>
    </div>
  </div>
  `
})
export class BusinessOverview {
  business = input.required<IBusinessProfile>();
  stats = input<IDashboardStats | null>(null);
  statsLoading = input<boolean>(false);
  businessSummary = input<IBusinessSummary | null>(null);

  visibilityAction = output<string>();
}
