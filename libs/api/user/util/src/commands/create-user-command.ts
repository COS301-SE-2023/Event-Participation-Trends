import { ICreateUserRequest } from '../requests';

export class CreateUserCommand {
  constructor(public readonly request: ICreateUserRequest) { }
}
