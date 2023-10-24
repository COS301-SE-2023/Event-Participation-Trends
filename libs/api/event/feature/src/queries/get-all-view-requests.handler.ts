import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllViewRequestsQuery, IGetAllViewRequestsResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { IUser } from '@event-participation-trends/api/user/util';


@QueryHandler(GetAllViewRequestsQuery)
export class GetAllViewRequestsHandler implements IQueryHandler<GetAllViewRequestsQuery, IGetAllViewRequestsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetAllViewRequestsQuery) {
        console.log(`${GetAllViewRequestsHandler.name}`);
        const request = query.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const userDoc = await this.userRepository.getUser(request.managerEmail ||"");

        //To Do:need to check if manager is manager of event or it manager is admin

        let eventViewRequestersDocs;
        if(userDoc.length != 0){
            eventViewRequestersDocs = await this.eventRepository.getPopulatedRequesters(eventIdObj);
        }
        return {users: <IUser[]>eventViewRequestersDocs};
    }
}