export interface ILocation {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface IProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  location: ILocation | null;
  createdAt: string;
  businessId: string | null;
  accountId: string;
  email: string;
  hasPassword?: boolean;
}
