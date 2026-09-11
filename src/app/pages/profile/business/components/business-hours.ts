import { Component, input } from '@angular/core';
import { LucideClock } from '@lucide/angular';
import { IBusinessProfile } from '../business.interface';
import { List, ListItem, ListItemContent, ListItemTitle, ListItemDescription } from '@odysseon/ur-ui';

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [
    LucideClock,
    List,
    ListItem,
    ListItemContent,
    ListItemTitle,
    ListItemDescription
  ],
  template: `
  <div class="biz-section">
    @if (business().operatingHours?.length) {
    <div class="panel">
      <div class="panel__body" style="padding: 0;">
        <ui-list [bordered]="false" [radius]="false">
          @for (hour of business().operatingHours; track hour.id) {
          <div uiListItem>
            <div uiListItemContent style="flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
              <div uiListItemTitle>{{ hour.day }}</div>
              @if (hour.isClosed) {
                <div uiListItemDescription class="biz-hours__closed">Closed</div>
              } @else {
                <div uiListItemDescription class="biz-hours__time">{{ hour.openTime }} – {{ hour.closeTime }}</div>
              }
            </div>
          </div>
          }
        </ui-list>
      </div>
    </div>
    } @else {
    <div class="empty-tab">
      <svg lucideClock aria-hidden="true"></svg>
      <p>No operating hours set yet.</p>
    </div>
    }
  </div>
  `
})
export class BusinessHours {
  business = input.required<IBusinessProfile>();
}
