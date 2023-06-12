import { DeclineViewRequestEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

@EventsHandler(DeclineViewRequestEvent)
export class DeclineViewRequestEventHandler implements IEventHandler<DeclineViewRequestEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    ) {}

    async handle(event: DeclineViewRequestEvent) {
        console.log(`${DeclineViewRequestEventHandler.name}`);
    
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");

        //remove userID from Requesters
        if(event.event.eventId != undefined)
            await this.eventRepository.removeEventViewRequest(event.event.eventId, userDoc[0]._id)

    }
}