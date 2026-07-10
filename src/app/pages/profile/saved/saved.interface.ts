export interface ISavedListingItem {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing: {
    id: string;
    businessProfileId: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    minPrice: number | null;
    maxPrice: number | null;
    currencyCode: string | null;
    isNegotiable: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IFollowedBusinessItem {
  businessId: string;
  id: string;
  userId: string;
  businessProfileId: string;
  createdAt: string;
  business: {
    media?: { url: string; type: string }[];
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    verificationStatus: string;
    isPublic: boolean;
    description: string | null;
    businessType: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IPaginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
