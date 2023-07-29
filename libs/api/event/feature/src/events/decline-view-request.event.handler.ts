import { DeclineViewRequestEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';


@EventsHandler(DeclineViewRequestEvent)
export class DeclineViewRequestEventHandler implements IEventHandler<DeclineViewRequestEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

    async handle(event: DeclineViewRequestEvent) {
        console.log(`${DeclineViewRequestEventHandler.name}`);
    
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");

        //remove userID from Requesters
        if(event.event.eventId != undefined){
            await this.eventRepository.removeEventViewRequest(event.event.eventId, userDoc[0]._id)
        
            const eventDoc = await this.eventRepository.getEventById(event.event.eventId);

            //notify user via Email
            if(eventDoc && eventDoc[0] && eventDoc[0].Name)
                this.emailService.sendEmail(
                    event.event.userEmail || "", 
                    EmailSubject.REJECT_VIEW_REQUEST,
                    EmailContent.REJECT_VIEW_REQUEST_CONTENT+ eventDoc[0].Name
                )
        }
    }
}