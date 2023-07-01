import { IDeviceLocation } from './device-location.interface';

export interface IDevice{
    DeviceId: string | undefined | null,
    Locations: IDeviceLocation[] | undefined | null
}