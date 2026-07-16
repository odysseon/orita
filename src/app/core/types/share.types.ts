export type BusinessIntent = { kind: 'business'; businessSlug: string };
export type ListingIntent = { kind: 'listing'; listingSlug: string };
export type TourIntent = { kind: 'tour'; tourId: string }; // leaving tourId as is if tours don't have slugs yet

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
