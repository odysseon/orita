export interface ILocation {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface IAccount {
  id: string;
  email: string;
  createdAt: string;
}

export interface IProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  location: ILocation | null;
  createdAt: string;
  account: IAccount;
  businessId: string | null;
}
