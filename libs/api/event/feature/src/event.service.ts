import {
    ICreateEventRequest,
    ICreateEventResponse,
    CreateEventCommand,
} from '@event-participation-trends/api/event/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class EventService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createEvent(request: ICreateEventRequest) {
        return await this.commandBus.execute<CreateEventCommand, ICreateEventResponse>(new CreateEventCommand(request));
    }
}