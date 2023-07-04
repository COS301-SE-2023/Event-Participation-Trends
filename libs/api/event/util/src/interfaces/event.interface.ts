import { IDevice } from "./device.interface";
import { IEventLocation } from "./event-location.interface";
import { IFloorLayout } from "./floorlayout.interface";
import { IStall } from "./stall.interface";
import { ISensor } from "./sensor.interface";
import { Types } from 'mongoose';

export interface IEvent {
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: IEventLocation | undefined | null;
    //thisFloorLayout?: IFloorLayout | undefined | null;
    Stalls?: IStall[] | undefined | null;
    Sensors?: ISensor[] | undefined | null;
    Devices?: IDevice[] | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Requesters?: Types.ObjectId[] | undefined | null;
    Viewers?: Types.ObjectId[] | undefined | null;
}