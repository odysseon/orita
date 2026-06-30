export interface IBusinessSummary {
  id: string;
  name: string;
  slug: string;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  categoryIds: string[];
  distanceKm?: number;
  isSaved?: boolean;
}

export interface IListingSummary {
  id: string;
  businessProfileId: string;
  businessProfileSlug?: string;
  title: string;
  slug: string;
  description: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  currencyCode: string | null;
  categoryId: string | null;
  isNegotiable: boolean;
  coverUrl?: string;
  isSaved?: boolean;
}

export interface IPaginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  children?: ICategory[];
}
