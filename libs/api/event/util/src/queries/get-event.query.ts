import { IGetEventRequest } from "../requests";

export class GetEventQuery {
    constructor(public readonly request: IGetEventRequest) {}
  }