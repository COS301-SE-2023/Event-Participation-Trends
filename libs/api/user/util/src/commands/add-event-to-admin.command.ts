import { IAddEventToAdminRequest } from '../requests';

export class AddEventToAdminCommand {
  constructor(public readonly request: IAddEventToAdminRequest) { }
}
