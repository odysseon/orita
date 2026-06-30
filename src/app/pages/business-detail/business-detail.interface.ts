export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type BusinessType = 'ONLINE' | 'PHYSICAL' | 'HYBRID';
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface IOperatingHours {
  id: string;
  businessProfileId: string;
  day: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface ITag {
  id: string;
  name: string;
  slug: string;
}

export interface IBusinessDetail {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  isPublic: boolean;
  verificationStatus: VerificationStatus;
  businessType: BusinessType;
  description: string | null;
  phoneNumber: string | null;
  whatsapp: string | null;
  email: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  categoryIds: string[];
  websiteUrl: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  operatingHours?: IOperatingHours[];
  tags?: ITag[];
  avatarUrl?: string;
  coverUrl?: string;
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
