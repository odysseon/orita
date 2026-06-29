export interface IBusiness {
  id: string;
  name: string;
  slug: string;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  categoryIds: string[];
}

export interface IBusinessPage {
  items: IBusiness[];
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
  children: ICategory[];
}
