import { IRoles } from './IRoles';

export interface IUser {
  id: number,
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  avatarImgUrl: string,
  description: string,
  roles: IRoles[]
}
