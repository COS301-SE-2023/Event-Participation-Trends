import { IGetUsersRequest } from '../requests';

export class GetUsersQuery {
  constructor(public readonly request: IGetUsersRequest) {}
}