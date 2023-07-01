import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventQuery, IGetEventResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IEvent } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';


@QueryHandler(GetEventQuery)
export class GetEventHandler implements IQueryHandler<GetEventQuery, IGetEventResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}
    
    async execute(query: GetEventQuery) {
        console.log(`${GetEventHandler.name}`);
        const request = query.request;

        const objEventId = <Types.ObjectId> <unknown> request.eventId;

        const eventDocs = await this.eventRepository.getPopulatedEvent(objEventId);
        
        return {event: eventDocs[0]};
    }

}