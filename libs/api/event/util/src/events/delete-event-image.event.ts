import { IAddImageToEvent} from '../interfaces';

export class DeleteEventImageEvent {
  constructor(public readonly event: IAddImageToEvent) {}
}
