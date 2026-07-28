export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
export type ListingAvailability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER';

export interface IReview {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface IListingDetail {
  id: string;
  businessProfileId: string;
  businessProfileSlug?: string;
  title: string;
  slug: string;
  description: string | null;
  status: ListingStatus;
  availability: ListingAvailability;
  minPrice: string | null;
  maxPrice: string | null;
  currencyCode: string | null;
  isNegotiable: boolean;
  categoryId: string | null;
  attributes: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  coverUrl?: string;
  galleryUrls?: string[];
  reviews?: IReview[];
  isSaved?: boolean;
}

export interface IBusinessLite {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  location: string | null;
  phoneNumber: string | null;
  whatsapp: string | null;
}
