import { IAddViewingEventByNameRequest } from '../requests';

export class AddViewingEventByNameCommand {
  constructor(public readonly request: IAddViewingEventByNameRequest) { }
}
