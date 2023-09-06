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
        let imageDoc = await this.eventRepositroy.findImageIdByEventId(eventIdObj);

        const SLEEP = promisify(setTimeout);

        while(!imageDoc.length){
            await SLEEP(500);
            imageDoc = await this.eventRepositroy.findImageIdByEventId(eventIdObj);
        }

        if(imageDoc[0]._id){
            const data: IAddImageToEvent ={
                eventId: eventIdObj,
                imageId: imageDoc[0]._id
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