import { Types } from 'mongoose';
export interface IUser {
	Email?: string | undefined | null;
	FirstName?: string | undefined | null;
	LastName?: string | undefined | null;
	photo?: string | undefined | null ;
	Role?: string | undefined | null;
    Viewing?: Types.ObjectId[] | undefined | null;
}