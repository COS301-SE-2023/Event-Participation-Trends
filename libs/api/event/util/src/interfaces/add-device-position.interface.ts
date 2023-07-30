import { IPosition } from "../interfaces";

export interface IAddDevicePosition{
    eventId: string | undefined | null,
    position :IPosition[] | undefined | null,
}