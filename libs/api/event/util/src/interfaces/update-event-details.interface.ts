import { Types } from 'mongoose';

export interface IUpdateEventDetails {
    EventId?: Types.ObjectId | undefined | null;
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: string | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Floorlayout?: string | undefined | null;
    PublicEvent?: boolean | undefined | null;
}