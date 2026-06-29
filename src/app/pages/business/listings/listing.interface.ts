export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';

export interface IListingPrice {
  minPrice: number | null;
  maxPrice: number | null;
  currencyCode: string;
  isNegotiable: boolean;
}

export interface IListing {
  id: string;
  businessProfileId: string;
  title: string;
  slug: string;
  description: string | null;
  status: ListingStatus;
  minPrice: string | null;
  maxPrice: string | null;
  currencyCode: string | null;
  isNegotiable: boolean;
  categoryId: string | null;
  attributes: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateListing {
  title: string;
  description: string;
  categoryId: string;
  price: IListingPrice;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  children: ICategory[];
}
