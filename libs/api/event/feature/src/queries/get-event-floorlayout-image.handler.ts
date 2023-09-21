import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventFloorlayoutImageQuery, IGetEventFloorlayoutImageResponse, IImage } from '@event-participation-trends/api/event/util';
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

        return {images :<IImage[]><unknown> eventDocs};
    }

}