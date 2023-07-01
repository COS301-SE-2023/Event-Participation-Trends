import { AcceptViewRequestEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(AcceptViewRequestEvent)
export class AcceptViewRequestEventHandler implements IEventHandler<AcceptViewRequestEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    ) {}

    async handle(event: AcceptViewRequestEvent) {
        console.log(`${AcceptViewRequestEventHandler.name}`);
    
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");

        if(event.event.eventId != undefined){
            //remove userID from Requesters
            await this.eventRepository.removeEventViewRequest(event.event.eventId, userDoc[0]._id)
        
            //add userID to Viewers
            await this.eventRepository.addViewer(userDoc[0]._id,event.event.eventId)
        }
        
    }
}