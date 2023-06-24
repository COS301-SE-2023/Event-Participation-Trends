import {IRemoveViewerRequest} from '../requests';

export class RemoveEventFromViewerCommand {
    constructor(public readonly request: IRemoveViewerRequest) {}
}