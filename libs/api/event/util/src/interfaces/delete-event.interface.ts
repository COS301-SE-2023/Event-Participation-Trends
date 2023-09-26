import { Types } from 'mongoose';

export interface IDeleteEvent {
    managerId?: Types.ObjectId | undefined | null;
    eventId?: Types.ObjectId | undefined | null;
    Viewers?: Types.ObjectId[] | undefined | null;
}