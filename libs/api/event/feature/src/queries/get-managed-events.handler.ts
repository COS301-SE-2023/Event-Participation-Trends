import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetManagedEventsQuery, IEvent, IGetManagedEventsResponse } from '@event-participation-trends/api/event/util';
import { Role } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';

@QueryHandler(GetManagedEventsQuery)
export class GetManagedEventsHandler implements IQueryHandler<GetManagedEventsQuery, IGetManagedEventsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetManagedEventsQuery) {
        console.log(`${GetManagedEventsHandler.name}`);
        const request = query.request;
        
        if(request.ManagerEmail != null && request.ManagerEmail != undefined){
            const managerDoc = await this.userRepository.getUser(request.ManagerEmail);
            if(managerDoc.length == 0)
            throw new HttpException(`Bad Request: user with email ${request.ManagerEmail} does not exist in DB`, 400);
            else {
                if(managerDoc[0].Role === Role.MANAGER){
                    const eventDocs = await this.eventRepository.getManagedEvents(managerDoc[0]._id);
                    if(eventDocs.length == 0)
                        return {events: <IEvent[]>[]};
                    else
                        return {events: <IEvent[]>eventDocs};
                }else{
                    return {events: <IEvent[]>[]};
                }
            }
        }else{
            return {events: <IEvent[]>[]};
        }
    } 
}