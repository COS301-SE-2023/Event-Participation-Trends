import { AddImageToEventCommand, IAddImageToEvent, IImageUploadResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { AddImageToEvent } from '../models';
import { Types } from 'mongoose';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { promisify } from 'util';

@CommandHandler(AddImageToEventCommand)
export class AddImageToEventHandler implements ICommandHandler<AddImageToEventCommand, IImageUploadResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepositroy: EventRepository,
      ) {}

    async execute(command: AddImageToEventCommand) {
        console.log(`${AddImageToEventHandler.name}`);
        
        const request = command.request; 
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        
        const SLEEP = promisify(setTimeout);
        await SLEEP(1000);
        const imageDoc = await this.eventRepositroy.findImagesIdByEventId(eventIdObj);

        /*  Adding lastly added image to event, will be at bottom of collection
        *   There is a sposibility that this is not the correct image, the db funcitons
        *   are configed to not add duplicates so this will not be a problem, in AddImageToEventEventHandler
        *   there is a check to ensure all images are correcly linked to the event
        */
        if(imageDoc[0]._id){
            const data: IAddImageToEvent ={
                eventId: eventIdObj,
                imageId: imageDoc[imageDoc.length -1]._id  
            }

            const event = this.publisher.mergeObjectContext(AddImageToEvent.fromData(data));
            event.add();
            event.commit();

            return { status : Status.SUCCESS };
        }else{
            return { status : Status.FAILURE };
        }
    }
}