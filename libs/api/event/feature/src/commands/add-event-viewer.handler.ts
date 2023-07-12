import { AddViewerCommand, IViewEvent, IAddViewerResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { ViewEvent } from '../models';
import { Types } from 'mongoose';
import { EventRepository } from '@event-participation-trends/api/event/data-access';

@CommandHandler(AddViewerCommand)
export class AddViewerHandler implements ICommandHandler<AddViewerCommand, IAddViewerResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepositroy: EventRepository,
      ) {}

    async execute(command: AddViewerCommand) {
        console.log(`${AddViewerHandler.name}`);
        
        const request = command.request; 
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const eventDoc = await this.eventRepositroy.getEventById(eventIdObj);

        if(eventDoc.length != 0){
            const data: IViewEvent ={
                UserEmail: request.userEmail,
                eventId: eventIdObj
            }

            const event = this.publisher.mergeObjectContext(ViewEvent.fromData(data));
            event.add();
            event.commit();
    
            return { status : Status.SUCCESS };
        }else{
            return { status : Status.FAILURE };
        }
    }
}