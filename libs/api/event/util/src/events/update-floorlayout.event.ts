import { IEventDetails} from '../interfaces';

export class UpdateFloorlayoutEvent{
  constructor(public readonly event: IEventDetails) {}
}