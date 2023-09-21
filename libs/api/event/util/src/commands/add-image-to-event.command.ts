import { IImageUploadRequest } from "../requests";

export class AddImageToEventCommand {
    constructor(public readonly request: IImageUploadRequest) {}
}