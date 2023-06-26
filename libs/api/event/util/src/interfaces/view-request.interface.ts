import { Types } from 'mongoose';

export interface IViewRequest{
    userEmail?: string | undefined | null,
    eventId?: Types.ObjectId  | undefined | null
}