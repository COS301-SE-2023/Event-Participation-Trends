import { IEventId } from "./eventID.interface";

export interface IUpdateStall {
    EventId: IEventId | undefined | null;
    Name?: string | undefined | null,
    x_coordinate?: number | undefined | null,
    y_coordinate?: number | undefined | null,
    width?: number | undefined | null,
    height?: number | undefined | null,
}