import { IDeleteEvent} from '../interfaces';

export class  RemoveEventFromViewersEvent{
  constructor(public readonly event: IDeleteEvent) {}
}