import { Types } from "mongoose";

export interface IImage{
    imageBase64: string | undefined | null;
    eventId: Types.ObjectId | undefined | null;
}
