import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { RemoveEventImageEvent } from '@event-participation-trends/api/event/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(RemoveEventImageEvent)
export class RemoveEventImageEventHandler implements IEventHandler<RemoveEventImageEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}
    
    async handle(event: RemoveEventImageEvent) {
        console.log(`${RemoveEventImageEventHandler.name}`);
        
        if(event.event.eventId && event.event.imageId){
            console.log(event.event.eventId);
            console.log(event.event.imageId);
            await this.eventRepository.removeEventImage(event.event.eventId, event.event.imageId)
        }
    }
}