import {
    ICreateEventRequest,
    ICreateEventResponse,
    CreateEventCommand,
    IGetAllEventsRequest,
    IGetAllEventsResponse,
    GetAllEventsQuery,
} from '@event-participation-trends/api/event/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class EventService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createEvent(request: ICreateEventRequest) {
        return await this.commandBus.execute<CreateEventCommand, ICreateEventResponse>(new CreateEventCommand(request));
    }

    async getAllEvent(request: IGetAllEventsRequest) {
        return await this.queryBus.execute<GetAllEventsQuery, IGetAllEventsResponse>(new GetAllEventsQuery(request));
    }
}