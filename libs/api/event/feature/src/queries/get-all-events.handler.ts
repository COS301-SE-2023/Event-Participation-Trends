import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetAllEventsQuery, IGetAllEventsResponse } from '@event-participation-trends/api/event/util';
import { Role } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IEvent } from '@event-participation-trends/api/event/util';

@QueryHandler(GetAllEventsQuery)
export class GetAllEventsHandler implements IQueryHandler<GetAllEventsQuery, IGetAllEventsResponse> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {}

    async execute(query: GetAllEventsQuery) {
        console.log(`${GetAllEventsHandler.name}`);
        const request = query.request;

        if (!request.AdminEmail)
            throw new Error('Missing required field: AdminEmail');
        
        const AdminDoc = await this.userRepository.getUser(request.AdminEmail);
        if(AdminDoc[0].Role === Role.ADMIN){
            const eventDocs = await this.eventRepository.getAllEvents();
            /*
            if(eventDocs.length !=0){
                let eventsArr:Event[] =[];
                eventDocs.forEach(element=>{
                    eventsArr.push(
                        new Event(
                            element.StartDate,
                            element.EndDate,
                            element.Name,
                            element.Category,
                            element.Location,
                            element.thisFloorLayout,
                            element.Stalls,
                            element.Sensors,
                            element.Devices,
                            element.BTIDtoDeviceBuffer,
                            element.TEMPBuffer,
                            element.Manager,
                            element.Requesters,
                            element.Viewers
                    ))
                })
            }
            */
            return {events: <IEvent[]>eventDocs};
        }else{
            throw new Error(`User with email ${request.AdminEmail} does not have admin Privileges`);
        }
    } 
}