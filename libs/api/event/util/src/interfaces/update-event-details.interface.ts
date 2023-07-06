import { IEventLocation } from "./event-location.interface";
import { Types } from 'mongoose';

export interface IUpdateEventDetails {
    EventId?: Types.ObjectId | undefined | null;
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: IEventLocation | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Floorlayout?: string | undefined | null;
}