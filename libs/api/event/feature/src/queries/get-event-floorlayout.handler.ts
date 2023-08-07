import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventFloorlayoutQuery, IGetEventFloorlayoutResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';


@QueryHandler(GetEventFloorlayoutQuery)
export class GetEventFloorlayoutHandler implements IQueryHandler<GetEventFloorlayoutQuery, IGetEventFloorlayoutResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}
    
    async execute(query: GetEventFloorlayoutQuery) {
        console.log(`${GetEventFloorlayoutHandler.name}`);
        const request = query.request;

        const objEventId = <Types.ObjectId> <unknown> request.eventId;

        const eventDocs = await this.eventRepository.getEventFloorlayout(objEventId);
        
        return <any>  {floorlayout: eventDocs[0].FloorLayout};
    }

}