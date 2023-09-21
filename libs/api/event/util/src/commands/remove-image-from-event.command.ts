import { IAddImageToEvent } from "../interfaces";

export class RemoveEventImageCommand {
    constructor(public readonly request: IAddImageToEvent) {}
}