import { SendViewRequestEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(SendViewRequestEvent)
export class SendViewRequestEventHandler implements IEventHandler<SendViewRequestEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    ) {}

  async handle(event: SendViewRequestEvent) {
    console.log(`${SendViewRequestEventHandler.name}`);
    
    const userDoc = await this.userRepository.getUser(event.event.UserEmail|| "");

    if(event.event.eventId != undefined)
        await this.eventRepository.createViewRequest(userDoc[0]._id, event.event.eventId);
    }
}