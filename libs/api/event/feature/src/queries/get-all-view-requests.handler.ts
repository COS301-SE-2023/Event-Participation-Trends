import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllViewRequestsQuery, IGetAllViewRequestsResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { IUser } from '@event-participation-trends/api/user/util';
import { DatabaseService } from '@event-participation-trends/api/database/feature';


@QueryHandler(GetAllViewRequestsQuery)
export class GetAllViewRequestsHandler implements IQueryHandler<GetAllViewRequestsQuery, IGetAllViewRequestsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository,
        private readonly databaseService: DatabaseService,
    ) {}

    async execute(query: GetAllViewRequestsQuery) {
        console.log(`${GetAllViewRequestsHandler.name}`);
        const request = query.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const userDoc = await this.userRepository.getUser(request.managerEmail ||"");

        //check if requester is manager of event or Admin
        if(!(await this.databaseService.checkManagerOrAdmin(eventIdObj,request.managerEmail || "")))
            return {users: <IUser[]> []}

        let eventViewRequestersDocs;
        if(userDoc.length != 0){
            eventViewRequestersDocs = await this.eventRepository.getPopulatedRequesters(eventIdObj);
        }
        return {users: <IUser[]>eventViewRequestersDocs};
    }
}