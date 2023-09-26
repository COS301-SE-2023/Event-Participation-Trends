import { Types } from "mongoose";

export interface IUpdateFloorLayoutImage{
    eventId: Types.ObjectId | undefined | null;
    imageId: Types.ObjectId | undefined | null;
    managerEmail: string | undefined | null;
    imgBase64: string | undefined | null;
    imageObj: string | undefined | null;
    imageScale: number | undefined | null;
    imageType: string | undefined | null;
}