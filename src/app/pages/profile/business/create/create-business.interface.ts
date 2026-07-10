export type BusinessType = 'ONLINE' | 'PHYSICAL' | 'HYBRID';

export interface ICreateBusiness {
  name: string;
  businessType: BusinessType;
  primaryCategoryId: string;
  secondaryCategoryIds?: string[];
}

export interface ICreateBusinessResponse {
  id: string;
  slug: string;
  name: string;
}
