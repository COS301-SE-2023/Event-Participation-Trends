import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetManagedEventsQuery, IEvent, IGetManagedEventsResponse } from '@event-participation-trends/api/event/util';
import { Role } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetManagedEventsQuery)
export class GetManagedEventsHandler implements IQueryHandler<GetManagedEventsQuery, IGetManagedEventsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetManagedEventsQuery) {
        console.log(`${GetManagedEventsHandler.name}`);
        const request = query.request;

        if (!request.ManagerEmail)
            throw new Error('Missing required field: ManagerEmail');
        
        const managerDoc = await this.userRepository.getUser(request.ManagerEmail);
        if(managerDoc.length == 0)
            throw new Error(`user with email ${request.ManagerEmail} does not exist in DB`);
        else {
            if(managerDoc[0].Role === Role.MANAGER){
                const eventDocs = await this.eventRepository.getManagedEvents(managerDoc[0]._id);
                if(eventDocs.length == 0)
                    throw new Error(`User with email ${request.ManagerEmail} does not manage any events`);
                else
                    return {events: <IEvent[]>eventDocs};
            }else{
                throw new Error(`User with email ${request.ManagerEmail} does not have manager Privileges`);
            }
        }
    } 
}