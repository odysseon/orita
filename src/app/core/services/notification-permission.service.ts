import { Injectable, inject } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationPermissionService {
  private readonly swPush = inject(SwPush);
  private readonly http = inject(HttpClient);

  constructor() {
    // Listen to subscription changes (like token rotation)
    this.swPush.subscription.subscribe(async (sub) => {
      if (sub) {
        await this.syncSubscription(sub);
      }
    });
  }

  get isSupported(): boolean {
    return this.swPush.isEnabled;
  }

  get permissionState(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  async subscribe(): Promise<void> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported/enabled.');
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<{ publicKey: string }>(
          `${environment.apiUrl}/notifications/push-subscriptions/vapid-public-key`
        )
      );

      const sub = await this.swPush.requestSubscription({
        serverPublicKey: response.publicKey,
      });

      await this.syncSubscription(sub);
      console.log('Successfully subscribed to push notifications.');
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
    }
  }

  async unsubscribe(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      const sub = await firstValueFrom(this.swPush.subscription);
      if (sub) {
        // 1. Tell backend to remove it
        await firstValueFrom(
          this.http.delete(`${environment.apiUrl}/notifications/push-subscriptions/current`, {
            body: { endpoint: sub.endpoint },
          })
        );
        // 2. Unsubscribe locally
        await sub.unsubscribe();
        console.log('Successfully unsubscribed from push notifications.');
      }
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
    }
  }

  private async syncSubscription(sub: PushSubscription): Promise<void> {
    const subJSON = sub.toJSON();
    if (!subJSON.keys || !subJSON.keys['p256dh'] || !subJSON.keys['auth']) {
      return;
    }

    const payload = {
      endpoint: sub.endpoint,
      p256dh: subJSON.keys['p256dh'],
      auth: subJSON.keys['auth'],
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };

    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/notifications/push-subscriptions`, payload)
      );
    } catch (err) {
      console.error('Failed to sync push subscription with backend:', err);
    }
  }
}
