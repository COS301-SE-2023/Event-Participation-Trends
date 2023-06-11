import { Types } from 'mongoose';

export interface IViewEvent{
    UserEmail?: string | undefined | null,
	eventId?: Types.ObjectId,
}