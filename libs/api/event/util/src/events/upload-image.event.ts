import { IImage } from "../interfaces";

export class UploadImageEvent {
    constructor(public readonly image: IImage) {}
}