export type BusinessType = 'ONLINE' | 'PHYSICAL' | 'HYBRID';

export interface ICreateBusiness {
  name: string;
  businessType: BusinessType;
  description: string;
}

export interface ICreateBusinessResponse {
  id: string;
  slug: string;
  name: string;
}
