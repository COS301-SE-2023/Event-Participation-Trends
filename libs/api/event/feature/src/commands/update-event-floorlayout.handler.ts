import { UpdateEventFloorLayoutImgCommand, IUpdateFloorLayoutImage, IUpdateEventFloorLayoutImgResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { UpdateFloorLayoutImage } from '../models';
import { Types } from 'mongoose';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { HttpException } from '@nestjs/common';

@CommandHandler(UpdateEventFloorLayoutImgCommand)
export class UpdateEventFloorLayoutImgHandler implements ICommandHandler<UpdateEventFloorLayoutImgCommand, IUpdateEventFloorLayoutImgResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}

    async execute(command: UpdateEventFloorLayoutImgCommand) {
        console.log(`${UpdateEventFloorLayoutImgHandler.name}`);
        
        const request = command.request; 

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const imageIdObj = <Types.ObjectId> <unknown> request.imageId;

        const eventDoc = await this.eventRepository.getEventById(eventIdObj);
        const userDoc = await this.userRepository.getUser(request.managerEmail || "");
        const imageDoc = await this.eventRepository.getImageById(imageIdObj);

        if(eventDoc && userDoc && !eventDoc[0].Manager?.equals(userDoc[0]._id))
            throw new HttpException(`Bad Request: Manager with Email ${request.managerEmail} does not manage Event with id ${request.eventId}`, 400);
            
        if(imageDoc && imageDoc[0].eventId && !eventDoc[0]._id?.equals(imageDoc[0].eventId))
            throw new HttpException(`Bad Request: Manager with Email ${request.managerEmail} does not manage photo with id ${request.imageId}`, 400);

        const data: IUpdateFloorLayoutImage={
            eventId: eventIdObj,
            imageId: imageIdObj,
            managerEmail: request.managerEmail,
            imgBase64: request.imgBase64,
            imageObj: request.imageObj,
            imageScale: request.imageScale,
            imageType: request.imageType,
        }

        const event = this.publisher.mergeObjectContext(UpdateFloorLayoutImage.fromData(data));
        event.update();
        event.commit();

        return { status : Status.SUCCESS };
    }
}