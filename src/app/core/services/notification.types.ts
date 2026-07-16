export interface NotificationView {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string; // Date string from API
}

export interface PaginatedNotifications {
  items: NotificationView[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NotificationState {
  unreadCount: number;
  latest: NotificationView[];
  loading: boolean;
  cursor: string | null;
  hasMore: boolean;
}
