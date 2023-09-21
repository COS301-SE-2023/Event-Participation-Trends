import { IAddImageToEvent } from '../interfaces';

export class AddImageToEventEvent {
  constructor(public readonly event: IAddImageToEvent) {}
}