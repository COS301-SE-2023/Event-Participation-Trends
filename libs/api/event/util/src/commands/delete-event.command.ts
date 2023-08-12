import { IDeleteEventRequest} from '../requests';

export class DeleteEventCommand {
  constructor(public readonly request: IDeleteEventRequest) {}
}
