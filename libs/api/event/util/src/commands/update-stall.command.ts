import { IUpdateStallRequest } from "../requests";

export class UpdateStallCommand {
    constructor(public readonly request: IUpdateStallRequest) {}
}