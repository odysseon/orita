export interface ICreateBusiness {
  name: string;
  primaryCategoryId: string;
  phoneNumber: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface ICreateBusinessResponse {
  id: string;
  slug: string;
  name: string;
}
