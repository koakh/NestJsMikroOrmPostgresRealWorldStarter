export interface IUserData {
  bio: string;
  email: string;
  image?: string;
  accessToken: string;
  username: string;
}

export interface IUserRO {
  user: IUserData;
}
