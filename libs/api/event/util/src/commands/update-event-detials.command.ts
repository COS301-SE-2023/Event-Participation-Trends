import { IUpdateEventDetailsRequest} from '../requests';

export class UpdateEventDetailsCommand {
  constructor(public readonly request: IUpdateEventDetailsRequest) {}
}