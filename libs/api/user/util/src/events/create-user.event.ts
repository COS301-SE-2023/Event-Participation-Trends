import { IUser } from '../interfaces';

export class CreateUserEvent {
  constructor(public readonly user: IUser) {}
}
