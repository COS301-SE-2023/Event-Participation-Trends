import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllEventsQuery, IGetAllEventsResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IEvent } from '@event-participation-trends/api/event/util';

@QueryHandler(GetAllEventsQuery)
export class GetAllEventsHandler implements IQueryHandler<GetAllEventsQuery, IGetAllEventsResponse> {
    constructor(
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetAllEventsQuery) {
        console.log(`${GetAllEventsHandler.name}`);
        
        const eventDocs = await this.eventRepository.getAllEvents();
        return {events: <IEvent[]> <unknown>eventDocs};
    } 
}