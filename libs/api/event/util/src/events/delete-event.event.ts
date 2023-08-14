import { IDeleteEvent} from '../interfaces';

export class DeleteEventEvent {
  constructor(public readonly event: IDeleteEvent) {}
}