import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventFloorlayoutImageQuery, IGetEventFloorlayoutImageResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';


@QueryHandler(GetEventFloorlayoutImageQuery)
export class GetEventFloorlayoutImageHandler implements IQueryHandler<GetEventFloorlayoutImageQuery, IGetEventFloorlayoutImageResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}
    
    async execute(query: GetEventFloorlayoutImageQuery) {
        console.log(`${GetEventFloorlayoutImageHandler.name}`);
        const request = query.request;

        const objEventId = <Types.ObjectId> <unknown> request.eventId;

        const eventDocs = await this.eventRepository.findImageByEventId(objEventId);

        if(eventDocs.length){
            return <any>  {
                floorlayoutImg: eventDocs[0].imageBase64,
                imageType: eventDocs[0].imageType,
                imageScale: eventDocs[0].imageScale,
            };
        }else{
            return {};
        }

    }

}