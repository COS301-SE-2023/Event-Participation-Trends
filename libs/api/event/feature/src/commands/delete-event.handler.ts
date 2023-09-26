import { DeleteEventCommand, IDeleteEvent, IDeleteEventResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { DeleteEvent } from '../models';
import { Types } from 'mongoose';
import { EventRepository } from '@event-participation-trends/api/event/data-access';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand, IDeleteEventResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepositroy: EventRepository,
      ) {}

    async execute(command: DeleteEventCommand) {
        console.log(`${DeleteEventHandler.name}`);
        
        const request = command.request; 
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
        const eventDoc = await this.eventRepositroy.getEventById(eventIdObj);

        if(eventDoc.length != 0){
            const data: IDeleteEvent ={
                managerId: eventDoc[0].Manager,
                eventId: eventIdObj,
                Viewers: eventDoc[0].Viewers,
            }

            const event = this.publisher.mergeObjectContext(DeleteEvent.fromData(data));
            event.deleteEvent();
            event.commit();
    
            return { status : Status.SUCCESS };
        }else{
            return { status : Status.FAILURE };
        }
    }
}