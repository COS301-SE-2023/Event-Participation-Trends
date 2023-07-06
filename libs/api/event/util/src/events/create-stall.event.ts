import { IStall } from "../interfaces";


export class CreateStallEvent {
    constructor(public readonly event: IStall) {}
}