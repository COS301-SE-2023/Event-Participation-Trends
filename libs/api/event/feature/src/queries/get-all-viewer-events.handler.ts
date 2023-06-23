import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { GetUserViewingEventsQuery, IGetUserViewingEventsResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IEvent } from '@event-participation-trends/api/event/util';

@QueryHandler(GetUserViewingEventsQuery)
export class GetUserViewingEventsHandler implements IQueryHandler<GetUserViewingEventsQuery, IGetUserViewingEventsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(query: GetUserViewingEventsQuery) {
        console.log(`${GetUserViewingEventsHandler.name}`);
        const request = query.request;

        const userDoc = await this.userRepository.getUser(request.userEmail);

        const eventDocs = await this.userRepository.getPopulatedViewingEvents(userDoc[0]._id);

        return {events: <IEvent[]>eventDocs};
    }
}