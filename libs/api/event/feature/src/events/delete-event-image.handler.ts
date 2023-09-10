import { DeleteEventImageEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(DeleteEventImageEvent)
export class DeleteEventImageEventHandler implements IEventHandler<DeleteEventImageEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: DeleteEventImageEvent) {
        console.log(`${DeleteEventImageEventHandler.name}`);
    
        if(event.event.imageId)
            await this.eventRepository.removeImage(event.event.imageId);
        
    }
}