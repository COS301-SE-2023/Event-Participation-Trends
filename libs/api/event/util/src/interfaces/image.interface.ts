import { Types } from "mongoose";

export interface IImage{
    imageBase64: string | undefined | null;
    eventId: Types.ObjectId | undefined | null;
    imageScale: number | undefined | null;
    imageType: string | undefined | null;
}
