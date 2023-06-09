import { IUpdateRoleRequest } from '../requests';

export class UpdateUserRoleCommand {
  constructor(public readonly request: IUpdateRoleRequest) { }
}
