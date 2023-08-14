import {IDeleteEvent} from '../interfaces';

export class RemoveEventFromViewersCommand {
    constructor(public readonly request: IDeleteEvent) {}
}