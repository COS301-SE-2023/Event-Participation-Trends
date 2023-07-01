import { Types } from 'mongoose';

export interface IRemoveViewer{
    userEmail?: string | undefined | null,
    eventId?: Types.ObjectId  | undefined | null
}