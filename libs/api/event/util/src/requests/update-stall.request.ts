import { IEventId, IStall } from "../interfaces";

export interface IUpdateStallRequest{
    eventId: IEventId | undefined | null,
    stall: IStall,
}