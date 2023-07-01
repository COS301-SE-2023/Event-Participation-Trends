import { IGetUserRoleRequest } from '../requests';

export class GetUserRoleQuery {
  constructor(public readonly request: IGetUserRoleRequest) {}
}