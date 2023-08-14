import { RemoveEventFromViewersEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(RemoveEventFromViewersEvent)
export class RemoveEventFromViewersEventHandler implements IEventHandler<RemoveEventFromViewersEvent> {
  constructor(
    private readonly userRepository: UserRepository,
    ) {}
    
    async handle(event: RemoveEventFromViewersEvent) {
        console.log(`${RemoveEventFromViewersEventHandler.name}`);
        
        if(event.event.eventId != null && event.event.eventId != undefined){
            const eventId = event.event.eventId;
            event.event.Viewers?.forEach((viewer)=>{
                this.userRepository.removeEvent(eventId,viewer);
            })
        }
    }
}