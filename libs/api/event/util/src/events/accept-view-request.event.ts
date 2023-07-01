import { IViewRequest} from '../interfaces';

export class AcceptViewRequestEvent {
  constructor(public readonly event: IViewRequest) {}
}