import { IAddViewingEventRequest } from '../requests';

export class AddViewingEventCommand {
  constructor(public readonly request: IAddViewingEventRequest) { }
}
