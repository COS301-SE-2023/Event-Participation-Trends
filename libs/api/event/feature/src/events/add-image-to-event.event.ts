import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { AddImageToEventEvent } from "@event-participation-trends/api/event/util";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

@EventsHandler(AddImageToEventEvent)
export class AddImageToEventEventHandler implements IEventHandler<AddImageToEventEvent> {
    constructor(
        private readonly eventRepository: EventRepository
    ) {}

    async handle(event: AddImageToEventEvent) {
        console.log(`${AddImageToEventEventHandler.name}`);

        const request = event.event;

        if(request.eventId != undefined && request.imageId != undefined){
            await this.eventRepository.addImageToEvent(request.eventId,request.imageId);
        }
    }

}