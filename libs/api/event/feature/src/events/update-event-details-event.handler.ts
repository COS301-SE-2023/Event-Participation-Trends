import { IUpdateEventDetails, UpdateEventDetialsEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(UpdateEventDetialsEvent)
export class UpdateEventDetialsEventHandler implements IEventHandler<UpdateEventDetialsEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

    async handle(event: UpdateEventDetialsEvent) {
        console.log(`${UpdateEventDetialsEventHandler.name}`);
        
        const request = <IUpdateEventDetails> event.event;

        if(request.EventId != null){
            let emailContent= "Updated Event Details: ";
            const eventDoc = await this.eventRepository.getEventById(request.EventId);

            if(request.Name != null && request.Name != undefined){
                let nameExists = false;
                const eventNames = await this.eventRepository.getALLEventNames();
                eventNames.forEach(element => {
                    if(element.Name==request.Name)
                        nameExists = true;
                })
                if(!nameExists){
                    await this.eventRepository.updateEventName(request.EventId,request.Name);
                    emailContent+= request.Name + EmailContent.NEW_LINE;
                    emailContent+= "\t New Event Name: "+ request.Name + EmailContent.NEW_LINE + EmailContent.NEW_LINE;
                } else{
                    //throw error here
                }
            }else{
                emailContent+= eventDoc[0].Name + EmailContent.NEW_LINE + EmailContent.NEW_LINE;
            }

            if(request.StartDate != null && request.StartDate != undefined){
                await this.eventRepository.updateEventStartDate(request.EventId,request.StartDate);
                emailContent+= "\t New Start Date: "+ request.StartDate + EmailContent.NEW_LINE;
            }

            if(request.EndDate != null && request.EndDate != undefined){
                await this.eventRepository.updateEventEndDate(request.EventId,request.EndDate);
                emailContent+= "\t New End Date: "+ request.EndDate + EmailContent.NEW_LINE;
            }

            if(request.Category != null && request.Category != undefined){
                await this.eventRepository.updateEventCategory(request.EventId,request.Category);
                emailContent+= "\t New Event Category: "+ request.Category + EmailContent.NEW_LINE;
            }

            if(request.Location != null && request.Location != undefined){
                await this.eventRepository.updateEventLocation(request.EventId,request.Location);
                emailContent+= "\t New Event Location: "+request.Location+ EmailContent.NEW_LINE
            }

            if(request.PublicEvent != null && request.PublicEvent != undefined){
                await this.eventRepository.updateEventVisibility(request.EventId,request.PublicEvent);
                emailContent+= "\t Public Event : "+(request.PublicEvent? "Yes" : "No")+ EmailContent.NEW_LINE
            }
            
            let userDoc;
            if(eventDoc[0].Manager != null && eventDoc[0].Manager != undefined)
                userDoc = await this.userRepository.getUserById(eventDoc[0].Manager); 

            if(userDoc != undefined && userDoc != null && userDoc[0])
                this.emailService.sendEmail(
                    userDoc[0]?.Email || "", 
                    EmailSubject.EVENT_DETAILS_UPDATED,
                    emailContent
                );

        }
    }
    
}