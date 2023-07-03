import { IDevice } from "./device.interface";
import { IEventLocation } from "./event-location.interface";
import { IFloorLayout } from "./floorlayout.interface";
import { IStall } from "./stall.interface";
import { ISensor } from "./sensor.interface";
import { ITEMP_DEVICE_TO_DT } from "./TEMP_DEVICE_TO_DT.interface";
import { ITEMP_DEVICE_BUFFER } from "./TEMP_DEVICE_BUFFER.interface";
import { IUser } from '@event-participation-trends/api/user/util'
import { Types } from 'mongoose';
import { IWall } from "./wall.interface";
import { MqttData } from "./mqtt-data.interface";
import { IMacToId } from "./mac-to-id.interface";

export interface IEvent {
    StartDate?: Date | undefined | null;
    EndDate?: Date | undefined | null;
    Name?: string | undefined | null;
    Category?: string | undefined | null;
    Location?: IEventLocation | undefined | null;
    //thisFloorLayout?: IFloorLayout | undefined | null;
    Walls?: IWall[] | undefined | null;
    Stalls?: IStall[] | undefined | null;
    Sensors?: ISensor[] | undefined | null;
    Devices?: IDevice[] | undefined | null;
    BTIDtoDeviceBuffer?: IMacToId[] | undefined | null;
    TEMPBuffer?: MqttData[] | undefined | null;
    Manager?: Types.ObjectId | undefined | null;
    Requesters?: Types.ObjectId[] | undefined | null;
    Viewers?: Types.ObjectId[] | undefined | null;
}