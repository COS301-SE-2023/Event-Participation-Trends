import { Types } from 'mongoose';
export interface ITEMP_DEVICE_BUFFER{
    DeviceId: string | undefined | null,
    SensorId: Types.ObjectId[] | undefined | null;
    TimeStamp: Date | undefined | null,
    SignalStrenght: number | undefined | null,
}