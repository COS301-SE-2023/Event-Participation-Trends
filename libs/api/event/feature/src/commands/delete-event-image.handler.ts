import { DeleteEventImageCommand, IAddImageToEvent, IDeleteEventImageResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { AddImageToEvent } from '../models';
import { Types } from 'mongoose';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { HttpException } from '@nestjs/common';

@CommandHandler(DeleteEventImageCommand)
export class DeleteEventImageHandler implements ICommandHandler<DeleteEventImageCommand, IDeleteEventImageResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepositroy: EventRepository,
        private readonly userRepository: UserRepository
      ) {}

    async execute(command: DeleteEventImageCommand) {
        console.log(`${DeleteEventImageHandler.name}`);
        
        const request = command.request; 
        
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const imageIdObj = <Types.ObjectId> <unknown> request.imageId;
        
        const eventDoc = await this.eventRepositroy.getEventById(eventIdObj)
        const imageDoc = await this.eventRepositroy.getImageById(imageIdObj);
        const userDoc = await this.userRepository.getUser(request.userEmail||"");

        if(eventDoc && userDoc && !eventDoc[0].Manager?.equals(userDoc[0]._id))
            throw new HttpException(`Bad Request: Manager with Email ${request.userEmail} does not manage Event with id ${request.eventId}`, 400);
        else if(imageDoc.length != 0){
            const data: IAddImageToEvent ={
                eventId: eventIdObj,
                imageId: imageIdObj,
            }   

            const event = this.publisher.mergeObjectContext(AddImageToEvent.fromData(data));
            event.deleteImage();
            event.commit();
    
            return { status : Status.SUCCESS };
        }else{
            return { status : Status.FAILURE };
        }
    }
}