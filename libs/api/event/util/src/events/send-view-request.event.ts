import { IViewEvent } from '../interfaces';

export class SendViewRequestEvent {
  constructor(public readonly event: IViewEvent) {}
}