import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventQuery, IGetEventResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';


@QueryHandler(GetEventQuery)
export class GetEventHandler implements IQueryHandler<GetEventQuery, IGetEventResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}
    
    async execute(query: GetEventQuery) {
        console.log(`${GetEventHandler.name}`);
        const request = query.request;

        if(request.eventId || request.eventName){
            if(request.eventName != null && request.eventName != undefined){
                const eventDocs = await this.eventRepository.getEventByName(request.eventName);

                return <any>  {event: eventDocs[0]};
            }else{
                const objEventId = <Types.ObjectId> <unknown> request.eventId;

                const eventDocs = await this.eventRepository.getPopulatedEventById(objEventId);
                
                return <any>  {event: eventDocs[0]};
            }
        }else{
            return null;
        }
    
    }

}