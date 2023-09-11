import { IUpdateFloorLayoutImage, UpdateEventFloorLayoutImgEvent } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(UpdateEventFloorLayoutImgEvent)
export class UpdateEventFloorLayoutImgEventHandler implements IEventHandler<UpdateEventFloorLayoutImgEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

    async handle(event: UpdateEventFloorLayoutImgEvent) {
        console.log(`${UpdateEventFloorLayoutImgEventHandler.name}`);
        
        const request = <IUpdateFloorLayoutImage> event.event;

        if(request.eventId && request.imageId){
            let emailContent= "Updated Event Floorlayout Image: "+ EmailContent.NEW_LINE;
            const eventDoc = await this.eventRepository.getEventById(request.eventId);
            emailContent += "Event Name: " + eventDoc[0].Name + EmailContent.NEW_LINE;

            if(request.imgBase64){
                await this.eventRepository.updateEventFloorlayoutImageimgBase64(request.imageId, request.imgBase64);
                emailContent+= "\t imgBase64 has been updated" + EmailContent.NEW_LINE;
            }

            if(request.imageObj){
                await this.eventRepository.updateEventFloorlayoutImageimageObj(request.imageId, request.imageObj);
                emailContent+= "\t New imageObj: "+ request.imageObj + EmailContent.NEW_LINE;
            }

            if(request.imageScale){
                await this.eventRepository.updateEventFloorlayoutImageimageScale(request.imageId, request.imageScale);
                emailContent+= "\t New imageScale: "+ request.imageScale.toString() + EmailContent.NEW_LINE;
            }

            if(request.imageType){
                await this.eventRepository.updateEventFloorlayoutImageimageType(request.imageId,request.imageType);
                emailContent+= "\t New imageType: "+ request.imageType + EmailContent.NEW_LINE;
            }
            
            let userDoc;
            if(eventDoc[0].Manager != null && eventDoc[0].Manager != undefined)
                userDoc = await this.userRepository.getUserById(eventDoc[0].Manager); 

            if(userDoc != undefined && userDoc != null && userDoc[0])
                this.emailService.sendEmail(
                    userDoc[0]?.Email || "", 
                    EmailSubject.EVENT_FLOORLAYOUT_IMAGE_UPDATED,
                    emailContent
                );

        }
    }
    
}