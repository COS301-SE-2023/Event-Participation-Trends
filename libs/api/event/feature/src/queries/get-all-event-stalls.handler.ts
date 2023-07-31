import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { GetAllEventStallsQuery, IGetAllEventStallsResponse, IStall } from "@event-participation-trends/api/event/util";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAllEventStallsQuery)
export class GetAllEventStallsHandler implements IQueryHandler<GetAllEventStallsQuery, IGetAllEventStallsResponse> {
    constructor(
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetAllEventStallsQuery) {
        console.log(`${GetAllEventStallsHandler.name}`);
        
        const eventStalls = await this.eventRepository.getAllEventStalls(query.request.EventId);
        return {eventStalls: <IStall[]> eventStalls};
    }
}