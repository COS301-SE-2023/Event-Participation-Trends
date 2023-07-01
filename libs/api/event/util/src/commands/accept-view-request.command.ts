import { IAcceptViewRequestRequest} from '../requests';

export class AcceptViewRequestCommand {
  constructor(public readonly request: IAcceptViewRequestRequest) {}
}