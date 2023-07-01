import { IDeclineViewRequestRequest} from '../requests';

export class DeclineViewRequestCommand {
  constructor(public readonly request: IDeclineViewRequestRequest) {}
}
