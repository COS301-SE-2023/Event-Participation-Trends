import { ISendViewRequestRequest} from '../requests';

export class SendViewRequestCommand {
  constructor(public readonly request: ISendViewRequestRequest) {}
}
