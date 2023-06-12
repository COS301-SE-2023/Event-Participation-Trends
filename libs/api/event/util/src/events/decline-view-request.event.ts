import { IDecelineView} from '../interfaces';

export class DeclineViewRequestEvent {
  constructor(public readonly event: IDecelineView) {}
}