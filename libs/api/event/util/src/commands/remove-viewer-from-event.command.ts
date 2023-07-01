import {IRemoveViewerRequest} from '../requests';

export class RemoveViewerFromEventCommand {
    constructor(public readonly request: IRemoveViewerRequest) {}
}