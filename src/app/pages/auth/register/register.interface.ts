export interface IRegister {
  email: string;
  password: string;
  username: string;
}

export interface IRegisterResponse {
  accountId: string;
  email: string;
  userId: string;
  username: string;
  createdAt: string;
}
