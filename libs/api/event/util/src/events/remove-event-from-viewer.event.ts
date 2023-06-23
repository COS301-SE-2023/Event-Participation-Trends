import { IRemoveViewer} from '../interfaces';

export class  RemoveEventFromViewerEvent{
  constructor(public readonly event: IRemoveViewer) {}
}