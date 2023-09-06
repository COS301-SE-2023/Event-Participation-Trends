import { Types } from "mongoose";

export interface IAddImageToEvent {
    eventId: Types.ObjectId | undefined | null,
    imageId: Types.ObjectId | undefined | null,
}