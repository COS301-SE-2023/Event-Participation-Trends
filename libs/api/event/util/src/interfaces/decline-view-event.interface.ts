import { Types } from 'mongoose';

export interface IDecelineView{
    userEmail?: string | undefined | null,
    eventId?: Types.ObjectId  | undefined | null
}