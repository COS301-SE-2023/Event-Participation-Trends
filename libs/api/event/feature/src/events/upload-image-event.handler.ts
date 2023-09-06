import { IImage, UploadImageEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(UploadImageEvent)
export class UploadImageEventHandler implements IEventHandler<UploadImageEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: UploadImageEvent) {
        console.log(`${UploadImageEventHandler.name}`);
        
        const request = <IImage> event.image;

        await this.eventRepository.uploadImage(request);
    }
    
}