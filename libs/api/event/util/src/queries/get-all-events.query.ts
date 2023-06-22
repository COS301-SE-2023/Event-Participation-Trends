import { IGetAllEventsRequest } from '../requests';

export class GetAllEventsQuery {
  constructor(public readonly request: IGetAllEventsRequest) {}
}