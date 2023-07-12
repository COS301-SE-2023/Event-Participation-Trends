import { IViewEvent} from '../interfaces';

export class AddViewerEvent{
  constructor(public readonly event: IViewEvent) {}
}