import { IEventId, IStall } from "../interfaces";

export interface ICreateStallRequest{
    EventId: IEventId | undefined | null,
    Stall: IStall,
}