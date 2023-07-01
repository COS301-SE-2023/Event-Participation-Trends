import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventWallsQuery, IGetAllEventWallsResponse, IWall } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose'

@QueryHandler(GetEventWallsQuery)
export class GetEventWallsHandler implements IQueryHandler<GetEventWallsQuery, IGetAllEventWallsResponse> {
    constructor(
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetEventWallsQuery) {
        console.log(`${GetEventWallsHandler.name}`);

        const eventIdObj = <Types.ObjectId> <unknown> query.request.eventId

        const eventDocs = await this.eventRepository.getAllEventWalls(eventIdObj);
        return {Walls: <IWall[]> <any>eventDocs[0]};
    } 
}