import { IViewRequest} from '../interfaces';

export class DeclineViewRequestEvent {
  constructor(public readonly event: IViewRequest) {}
}