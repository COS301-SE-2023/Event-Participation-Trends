import { IGetEventStatisticsRequest } from "../requests";

export class GetEventStatisticsQuery {
    constructor(public readonly request: IGetEventStatisticsRequest) {}
  }