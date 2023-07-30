import { IUpdateEventDetails, UpdateEventDetialsEvent, UpdateFloorlayoutEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(UpdateFloorlayoutEvent)
export class UpdateFloorlayoutEventHandler implements IEventHandler<UpdateEventDetialsEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: UpdateEventDetialsEvent) {
        console.log(`${UpdateFloorlayoutEventHandler.name}`);
        
        const request = <IUpdateEventDetails> event.event;

        if(request.EventId != null){
            await this.eventRepository.updateEventFloorlayout(request.EventId, request.Floorlayout || "");
        }
    }
    
}