import { IAddImageToEvent} from '../interfaces';

export class RemoveEventImageEvent {
  constructor(public readonly event: IAddImageToEvent) {}
}
