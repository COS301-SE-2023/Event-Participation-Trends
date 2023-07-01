import { IGetAllEventWallsRequest } from "../requests";

export class GetEventWallsQuery {
    constructor(public readonly request: IGetAllEventWallsRequest) {}
  }