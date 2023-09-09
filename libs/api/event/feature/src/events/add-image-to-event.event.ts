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

        //ensure all images added to event
        if(request.eventId){
            const eventDoc = await this.eventRepository.getEventById(request.eventId);
            const numImgEvent = eventDoc[0].FloorLayout?.length;
            const ImgOfEventId = await this.eventRepository.findImagesIdByEventId(request.eventId);

            if(numImgEvent != ImgOfEventId.length){
                //Add each image individually
                    ImgOfEventId.forEach(async img =>{
                        if(request.eventId)
                            await this.eventRepository.addImageToEvent(request.eventId,img._id);
                    })
            }
        }
    
    }

}