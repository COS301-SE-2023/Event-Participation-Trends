import { IEventDetails } from '../interfaces';

export class CreateEventEvent {
  constructor(public readonly event: IEventDetails) {}
}