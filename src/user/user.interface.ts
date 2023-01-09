import { Role } from "./user.entity";

export interface IUserData {
  username: string;
  email: string;
  accessToken: string;
  roles: Role[];
  bio: string;
  image: string;
}

export interface IUserRO {
  user: IUserData;
}
