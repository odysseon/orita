export type BusinessIntent = { kind: 'business'; businessId: string };
export type ListingIntent = { kind: 'listing'; listingId: string };
export type TourIntent = { kind: 'tour'; tourId: string };

export type ShareIntent = BusinessIntent | ListingIntent | TourIntent;

export type ShareTarget =
  | { kind: 'conversation'; conversationId: string }
  | { kind: 'user'; userId: string };

export interface UserSearchResult {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: string;
}
