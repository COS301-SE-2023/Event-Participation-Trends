import { Types } from 'mongoose';

export interface IEventDetails {
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: string | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Floorlayout?: string | undefined | null;
}