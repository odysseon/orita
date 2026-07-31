export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type BusinessType = 'ONLINE' | 'PHYSICAL' | 'HYBRID';
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type ServiceAreaType = 'INHERIT' | 'RADIUS' | 'POLYGON' | 'ADMIN_REGION' | 'NATIONWIDE' | 'REMOTE';
export type ServiceMode = 'AT_LOCATION' | 'MOBILE' | 'REMOTE' | 'DELIVERY' | 'PICKUP';

export interface IBaseServiceArea {
  id?: string;
  name?: string | null;
  type: ServiceAreaType;
  administrativeRegionId?: string | null;
  radiusKm?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  polygon?: Array<[number, number]> | null;
  displayOrder?: number;
  enabled?: boolean;
}


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

export interface IBusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  isPublic: boolean;
  businessType: BusinessType;
  description: string | null;
  websiteUrl: string | null;
  contactPhone: string | null;
  whatsapp: string | null;
  contactEmail: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  primaryCategoryId: string | null;
  secondaryCategoryIds: string[];
  createdAt: string;
  updatedAt: string;
  operatingHours?: IOperatingHours[];
  tags?: ITag[];
  avatarUrl?: string;
  coverUrl?: string;
  serviceModes?: ServiceMode[];
  serviceAreas?: IBaseServiceArea[];
}

export interface IDashboardStats {
  totalListings: number;
  profileViews: number;
  totalSaves: number;
  totalContactClicks: number;
}
