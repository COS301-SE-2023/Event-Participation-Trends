import { RemoveViewerFromEventEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(RemoveViewerFromEventEvent)
export class RemoveViewerFromEventEventHandler implements IEventHandler<RemoveViewerFromEventEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    ) {}
    
    async handle(event: RemoveViewerFromEventEvent) {
        console.log(`${RemoveViewerFromEventEventHandler.name}`);
        
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");
    
        if(event.event.eventId != undefined)
            await this.eventRepository.removeViewer(event.event.eventId,userDoc[0]._id);
    }
}