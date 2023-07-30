import { AddViewerEvent, IViewEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(AddViewerEvent)
export class AddViewerEventHandler implements IEventHandler<AddViewerEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepisitory: UserRepository
    ) {}

    async handle(event: AddViewerEvent) {
        console.log(`${AddViewerEventHandler.name}`);
        
        const request = <IViewEvent> event.event;
        const userDoc = await this.userRepisitory.getUser(request.UserEmail||"");

        if(userDoc.length !=0 && request.eventId != null){
            await this.eventRepository.addViewer(userDoc[0]._id, request.eventId);
        }
    }
    
}