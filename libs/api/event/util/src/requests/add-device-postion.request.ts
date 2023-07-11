import { IPosition } from "../interfaces";

export interface IAddDevicePositionRequest{
    eventId: string | undefined | null,
    position :IPosition[] | undefined | null,
}