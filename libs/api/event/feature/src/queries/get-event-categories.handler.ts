import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllEventCategoriesQuery, IGetAllEventCategoriesResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { elementAt } from 'rxjs';

@QueryHandler(GetAllEventCategoriesQuery)
export class GetAllEventCategoriesHandler implements IQueryHandler<GetAllEventCategoriesQuery, IGetAllEventCategoriesResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}

    async execute() {
        console.log(`${GetAllEventCategoriesHandler.name}`);

        const eventCategoriesDoc = await this.eventRepository.getAllEventCategories();
        
        return {categories: eventCategoriesDoc};
    }
}