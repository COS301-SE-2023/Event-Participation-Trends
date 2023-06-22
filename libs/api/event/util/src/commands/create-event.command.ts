import { ICreateEventRequest} from '../requests';

export class CreateEventCommand {
  constructor(public readonly request: ICreateEventRequest) {}
}
