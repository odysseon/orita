import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationView } from '../../core/services/notification.types';
import { LucideBell, LucideTag } from '@lucide/angular';
import { List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd } from '../../shared/ui/surfaces/list/list';
import { Button } from '../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DatePipe, LucideBell, LucideTag, List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd, Button],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsPage {
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  onNotificationClick(notif: NotificationView): void {
    if (!notif.isRead) {
      this.notificationService.markAsRead(notif.id);
    }
    if (notif.actionUrl) {
      this.router.navigateByUrl(notif.actionUrl);
    }
  }
}
