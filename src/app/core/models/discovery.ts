export enum NearbyItemKind {
  OPPORTUNITY_POST = 'OPPORTUNITY_POST',
  EVENT            = 'EVENT',
  BUSINESS_FLASH   = 'BUSINESS_FLASH',
  EMERGENCY        = 'EMERGENCY',
}

export interface NearbyItemDto {
  id: string;
  kind: NearbyItemKind;
  title: string;
  body?: string;
  subtype: string;
  status: string;
  location: {
    id: string;
    name: string;
    formattedAddress?: string;
  };
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  postedAs?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  media: { url: string; mimeType: string }[];
  expiresAt?: string;
  editableUntil?: string;
  createdAt: string;
  capabilities?: {
    canReply: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canComplete: boolean;
  };
}

export interface NearbyResultPageDto {
  items: NearbyItemDto[];
  rankingVersion: string;
  cursorScore?: number;
  cursorId?: string;
  hasMore: boolean;
}

export interface NearbyQueryParams {
  lat: number;
  lng: number;
  radiusKm?: number;
  limit?: number;
  cursorScore?: number;
  cursorId?: string;
  types?: string[];
}
