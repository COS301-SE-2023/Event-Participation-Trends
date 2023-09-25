import { DeleteEventEvent } from '@event-participation-trends/api/event/util';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';


@EventsHandler(DeleteEventEvent)
export class DeleteEventEventHandler implements IEventHandler<DeleteEventEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

    async handle(event: DeleteEventEvent) {
        console.log(`${DeleteEventEventHandler.name}`);
    
        let userDoc;
        if(event.event.managerId !=null && event.event.managerId != undefined)
            userDoc = await this.userRepository.getUserById(event.event.managerId);


        if(event.event.eventId != undefined){
            const eventDoc = await this.eventRepository.getEventById(event.event.eventId);

            await this.eventRepository.deleteEventbyId(event.event.eventId);
        
            //notify user via Email
            if(userDoc && eventDoc && eventDoc[0] && eventDoc[0].Name)
                this.emailService.sendEmail(
                    userDoc[0].Email || "", 
                    EmailSubject.EVENT_DELETED,
                    EmailContent.EVENT_DELETED_CONTENT+ eventDoc[0].Name
                )
        }
    }
}