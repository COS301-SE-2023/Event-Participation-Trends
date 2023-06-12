import { IAddViewEvent } from '../interfaces';

export class AddViewingEventEvent {
  constructor(public readonly request: IAddViewEvent) {}
}