import { ICreateStallRequest } from "../requests";

export class CreateStallCommand {
    constructor(public readonly request: ICreateStallRequest) {}
}