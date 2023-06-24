import { IUpdateEventDetails} from '../interfaces';

export class UpdateEventDetialsEvent{
  constructor(public readonly event: IUpdateEventDetails) {}
}