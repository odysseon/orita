import { Service, inject, signal, computed, OnDestroy, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationView, PaginatedNotifications, NotificationState } from './notification.types';
import { firstValueFrom } from 'rxjs';

@Service()
export class NotificationService implements OnDestroy {
  #http = inject(HttpClient);
  #auth = inject(AuthService);
  #apiUrl = environment.apiUrl;
  #wsUrl = environment.apiUrl.replace('/api', '');

  #socket: Socket | null = null;

  // Centralized State
  #state = signal<NotificationState>({
    unreadCount: 0,
    latest: [],
    loading: false,
    cursor: null,
    hasMore: true,
  });

  // Selectors
  readonly unreadCount = computed(() => this.#state().unreadCount);
  readonly notifications = computed(() => this.#state().latest);
  readonly isLoading = computed(() => this.#state().loading);
  readonly hasMore = computed(() => this.#state().hasMore);

  constructor() {
    // Re-connect / reload when user logs in
    effect(() => {
      const token = this.#auth.token();
      if (token) {
        this.startup();
      } else {
        this.disconnect();
        this.#state.set({
          unreadCount: 0,
          latest: [],
          loading: false,
          cursor: null,
          hasMore: true,
        });
      }
    });
  }

  async startup(): Promise<void> {
    await Promise.all([this.loadUnreadCount(), this.loadInitial()]);
    this.connect();
  }

  private async loadUnreadCount(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.#http.get<{ count: number }>(`${this.#apiUrl}/notifications/unread-count`)
      );
      this.#state.update((s) => ({ ...s, unreadCount: res.count }));
    } catch (e) {
      console.error('Failed to load unread count', e);
    }
  }

  async loadInitial(): Promise<void> {
    this.#state.update((s) => ({ ...s, loading: true, cursor: null, latest: [], hasMore: true }));
    try {
      const res = await firstValueFrom(
        this.#http.get<PaginatedNotifications>(`${this.#apiUrl}/notifications`)
      );
      this.#state.update((s) => ({
        ...s,
        loading: false,
        latest: res.items,
        cursor: res.nextCursor || null,
        hasMore: res.hasMore,
      }));
    } catch (e) {
      console.error('Failed to load notifications', e);
      this.#state.update((s) => ({ ...s, loading: false }));
    }
  }

  async loadMore(): Promise<void> {
    const s = this.#state();
    if (s.loading || !s.hasMore) return;

    this.#state.update((s) => ({ ...s, loading: true }));
    try {
      const params: any = {};
      if (s.cursor) params.cursor = s.cursor;

      const res = await firstValueFrom(
        this.#http.get<PaginatedNotifications>(`${this.#apiUrl}/notifications`, { params })
      );
      this.#state.update((s) => ({
        ...s,
        loading: false,
        latest: [...s.latest, ...res.items],
        cursor: res.nextCursor || null,
        hasMore: res.hasMore,
      }));
    } catch (e) {
      console.error('Failed to load more notifications', e);
      this.#state.update((s) => ({ ...s, loading: false }));
    }
  }

  async markAsRead(id: string): Promise<void> {
    const s = this.#state();
    const notif = s.latest.find((n) => n.id === id);
    if (!notif || notif.isRead) return;

    // Optimistic update
    this.#state.update((state) => ({
      ...state,
      unreadCount: Math.max(0, state.unreadCount - 1),
      latest: state.latest.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));

    try {
      await firstValueFrom(
        this.#http.patch<NotificationView>(`${this.#apiUrl}/notifications/${id}/read`, {})
      );
    } catch (e) {
      // Revert optimistic update
      this.#state.update((state) => ({
        ...state,
        unreadCount: state.unreadCount + 1,
        latest: state.latest.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      }));
      console.error('Failed to mark as read', e);
    }
  }

  async markAllAsRead(): Promise<void> {
    if (this.#state().unreadCount === 0) return;

    // Optimistic
    this.#state.update((state) => ({
      ...state,
      unreadCount: 0,
      latest: state.latest.map((n) => ({ ...n, isRead: true })),
    }));

    try {
      await firstValueFrom(this.#http.patch(`${this.#apiUrl}/notifications/read-all`, {}));
    } catch (e) {
      // Revert is harder for read-all, simple reload instead
      this.startup();
      console.error('Failed to mark all as read', e);
    }
  }

  private connect(): void {
    if (this.#socket?.connected) return;

    const token = this.#auth.token();
    if (!token) return;

    this.#socket = io(`${this.#wsUrl}/ws/notifications`, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    });

    this.#socket.on('connect', () => {
      this.#socket?.emit('notifications:join');
    });

    this.#socket.on('notification:new', (notification: NotificationView) => {
      this.#state.update((s) => ({
        ...s,
        unreadCount: s.unreadCount + 1,
        latest: [notification, ...s.latest],
      }));
    });
  }

  private disconnect(): void {
    this.#socket?.disconnect();
    this.#socket = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
