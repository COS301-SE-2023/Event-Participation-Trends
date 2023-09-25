import { IImageUploadRequest } from "../requests";

export class UploadImageCommand {
    constructor(public readonly request: IImageUploadRequest) {}
}