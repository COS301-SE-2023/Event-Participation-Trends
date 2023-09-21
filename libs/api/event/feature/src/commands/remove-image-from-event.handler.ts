import { RemoveEventImageCommand, IAddImageToEvent , IDeleteEventImageResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { AddImageToEvent } from '../models';

@CommandHandler(RemoveEventImageCommand)
export class RemoveEventImageHandler implements ICommandHandler<RemoveEventImageCommand, IDeleteEventImageResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}
    
    async execute(command: RemoveEventImageCommand) {
        console.log(`${RemoveEventImageHandler.name}`);
        
        const request = command.request;
    
        const data: IAddImageToEvent ={
            eventId: request.eventId,
            imageId: request.imageId,
        }

        const event = this.publisher.mergeObjectContext(AddImageToEvent.fromData(data));
        event.deleteImageFromEvent();
        event.commit();

        return { status : Status.SUCCESS };
    }
}