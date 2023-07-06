import { IAddViewEvent } from '../interfaces';

export class AddEventToAdminEvent {
  constructor(public readonly request: IAddViewEvent) {}
}