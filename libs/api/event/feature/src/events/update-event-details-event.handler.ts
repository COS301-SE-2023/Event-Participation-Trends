import { IUpdateEventDetails, UpdateEventDetialsEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(UpdateEventDetialsEvent)
export class UpdateEventDetialsEventHandler implements IEventHandler<UpdateEventDetialsEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: UpdateEventDetialsEvent) {
        console.log(`${UpdateEventDetialsEventHandler.name}`);
        
        const request = <IUpdateEventDetails> event.event;

        if(request.EventId != null){
            if(request.StartDate != null && request.StartDate != undefined)
                await this.eventRepository.updateEventStartDate(request.EventId,request.StartDate);

            if(request.EndDate != null && request.EndDate != undefined)
                await this.eventRepository.updateEventEndDate(request.EventId,request.EndDate);
            
            if(request.Name != null && request.Name != undefined){
                let nameExists = false;
                const eventNames = await this.eventRepository.getALLEventNames();
                eventNames.forEach(element => {
                    if(element.Name==request.Name)
                        nameExists = true;
                })
                if(!nameExists)
                    await this.eventRepository.updateEventName(request.EventId,request.Name);
                else{
                    //throw error here
                }
            }

            if(request.Category != null && request.Category != undefined)
                await this.eventRepository.updateEventCategory(request.EventId,request.Category);

            if(request.Location != null && request.Location != undefined)
                await this.eventRepository.updateEventLocation(request.EventId,request.Location);

        }
    }
    
}