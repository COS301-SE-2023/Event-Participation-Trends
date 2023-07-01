import { IUpdateUserRole } from '../interfaces';

export class UpdateUserRoleEvent {
  constructor(public readonly request: IUpdateUserRole) {}
}