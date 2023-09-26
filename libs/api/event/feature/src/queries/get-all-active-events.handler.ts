import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllActiveEventsQuery, IGetAllActiveEventsResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IEvent } from '@event-participation-trends/api/event/util';

@QueryHandler(GetAllActiveEventsQuery)
export class GetAllActiveEventsHandler implements IQueryHandler<GetAllActiveEventsQuery, IGetAllActiveEventsResponse> {
    constructor(
        private readonly eventRepository: EventRepository
    ) {}

    async execute() {
        console.log(`${GetAllActiveEventsHandler.name}`);
        
        const eventDocs = await this.eventRepository.getAllActiveEvents();
        return {events: <IEvent[]> <unknown>eventDocs};
    } 
}