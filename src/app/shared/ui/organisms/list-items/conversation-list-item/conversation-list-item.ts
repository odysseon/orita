import { Component, input, ViewEncapsulation } from '@angular/core';
import { 
  ListItem, 
  ListItemStart, 
  ListItemContent, 
  ListItemTitle, 
  ListItemDescription 
} from 'ur-ui';
import { Avatar } from 'ur-ui';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'ui-conversation-list-item',
  standalone: true,
  imports: [
    ListItem, 
    ListItemStart, 
    ListItemContent, 
    ListItemTitle, 
    ListItemDescription,
    Avatar,
    DatePipe
  ],
  template: `
    <button uiListItem class="ui-conversation-list-item" [class.is-active]="active()">
      <div uiListItemStart>
        <app-avatar
          [src]="conversation().participant.avatarUrl || null"
          [alt]="conversation().participant.name"
          [fallback]="conversation().participant.name.charAt(0)"
          size="md"
        ></app-avatar>
      </div>
      
      <div uiListItemContent>
        <div class="ui-conversation-list-item__header">
          <div uiListItemTitle [class.is-unread]="conversation().unreadCount > 0">
            {{ conversation().participant.name }}
          </div>
          <div class="ui-conversation-list-item__time" [class.is-unread]="conversation().unreadCount > 0">
            {{ conversation().lastMessageAt | date:'shortTime' }}
          </div>
        </div>
        
        <div class="ui-conversation-list-item__footer">
          <div uiListItemDescription class="ui-conversation-list-item__snippet" [class.is-unread]="conversation().unreadCount > 0">
            {{ conversation().lastMessageSnippet }}
          </div>
          @if (conversation().unreadCount > 0) {
            <div class="ui-conversation-list-item__badge">
              {{ conversation().unreadCount > 99 ? '99+' : conversation().unreadCount }}
            </div>
          }
        </div>
      </div>
    </button>
  `,
  styleUrl: './conversation-list-item.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ui-conversation-list-item-host'
  }
})
export class ConversationListItem {
  active = input<boolean>(false);

  // We accept a generic participant (user or business)
  // We decompose the identity rather than composing UserIdentity directly,
  // to properly align the last message text underneath the name (WhatsApp style layout).
  conversation = input.required<{
    id: string;
    participant: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
    lastMessageSnippet: string;
    lastMessageAt: Date;
    unreadCount: number;
  }>();
}
