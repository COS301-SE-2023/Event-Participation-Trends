import { UpdateEventDetailsCommand, IUpdateEventDetails, IUpdateEventDetailsResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { UpdateEventDetails } from '../models';
import { Types } from 'mongoose';

@CommandHandler(UpdateEventDetailsCommand)
export class UpdateEventDetailsHandler implements ICommandHandler<UpdateEventDetailsCommand, IUpdateEventDetailsResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}

    async execute(command: UpdateEventDetailsCommand) {
        console.log(`${UpdateEventDetailsHandler.name}`);
        
        const request = command.request; 

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        const data: IUpdateEventDetails={
            EventId: eventIdObj,
            StartDate: request.eventDetails.StartDate,
            EndDate: request.eventDetails.EndDate,
            Name: request.eventDetails.Name,
            Category: request.eventDetails.Category,
            Location: request.eventDetails.Location,
            Manager: request.eventDetails.Manager,
        }
    
        const event = this.publisher.mergeObjectContext(UpdateEventDetails.fromData(data));
        event.update();
        event.commit();

        return { status : Status.SUCCESS };
    }
}