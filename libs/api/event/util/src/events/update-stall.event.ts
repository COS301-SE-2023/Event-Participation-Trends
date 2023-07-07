import { IStall } from "../interfaces";

export class UpdateStallEvent {
    constructor(public readonly stall: IStall) {}
}