import { UpdateFloorlayoutCommand, IUpdateEventDetails, IUpdateFloorlayoutResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { UpdateEventDetails } from '../models';
import { Types } from 'mongoose';

@CommandHandler(UpdateFloorlayoutCommand)
export class UpdateFloorlayoutHandler implements ICommandHandler<UpdateFloorlayoutCommand, IUpdateFloorlayoutResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}

    async execute(command: UpdateFloorlayoutCommand) {
        console.log(`${UpdateFloorlayoutHandler.name}`);
        
        const request = command.request; 

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        const data: IUpdateEventDetails={
            EventId: eventIdObj,
            Floorlayout: request.floorlayout,
        }

        const event = this.publisher.mergeObjectContext(UpdateEventDetails.fromData(data));
        event.updateFloorlayout();
        event.commit();

        return { status : Status.SUCCESS };
    }
}