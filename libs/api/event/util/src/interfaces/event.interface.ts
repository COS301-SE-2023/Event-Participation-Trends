import { IFloorLayout } from "./floorlayout.interface";
import { IStall } from "./stall.interface";
import { ISensor } from "./sensor.interface";
import { Types } from 'mongoose';
import { IPosition } from "./position.interface";
import { ChatMessage } from "./chat-message.interface";

export interface IEvent {
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: string | undefined | null;
    FloorLayout?: IFloorLayout | undefined | null;
    FloorLayoutImg?: Types.ObjectId[] | undefined | null;
    Stalls?: IStall[] | undefined | null;
    Sensors?: ISensor[] | undefined | null;
    Devices?: IPosition[] | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Requesters?: Types.ObjectId[] | undefined | null;
    Viewers?: Types.ObjectId[] | undefined | null;
    PublicEvent?: boolean | undefined | null;
    eventChats?: ChatMessage[] | undefined | null;
}