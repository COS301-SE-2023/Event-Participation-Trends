import { RemoveEventFromViewerEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(RemoveEventFromViewerEvent)
export class RemoveEventFromViewerEventHandler implements IEventHandler<RemoveEventFromViewerEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    ) {}
    
    async handle(event: RemoveEventFromViewerEvent) {
        console.log(`${RemoveEventFromViewerEventHandler.name}`);
        
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");
        
        if(event.event.eventId != undefined)
            await this.userRepository.removeEvent(event.event.eventId,userDoc[0]._id);
    }
}