import { AcceptViewRequestEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';

@EventsHandler(AcceptViewRequestEvent)
export class AcceptViewRequestEventHandler implements IEventHandler<AcceptViewRequestEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

    async handle(event: AcceptViewRequestEvent) {
        console.log(`${AcceptViewRequestEventHandler.name}`);
    
        const userDoc = await this.userRepository.getUser(event.event.userEmail|| "");

        if(event.event.eventId != undefined){
            const eventDoc = await this.eventRepository.getEventById(event.event.eventId);

            //remove userID from Requesters
            await this.eventRepository.removeEventViewRequest(event.event.eventId, userDoc[0]._id)
        
            //add userID to Viewers
            await this.eventRepository.addViewer(userDoc[0]._id,event.event.eventId)

            //notify user via Email
            this.emailService.sendEmail(
                event.event.userEmail || "", 
                EmailSubject.ACCEPT_VIEW_REQUEST,
                EmailContent.ACCEPT_VIEW_REQUEST_CONTENT+ eventDoc[0].Name
            )
        }
        
    }
}