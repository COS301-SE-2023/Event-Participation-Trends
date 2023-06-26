import { IRemoveViewer} from '../interfaces';

export class RemoveViewerFromEventEvent{
  constructor(public readonly event: IRemoveViewer) {}
}