import { RemoveEventFromViewersCommand, IDeleteEvent, IDeleteEventResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { DeleteEvent } from '../models';

@CommandHandler(RemoveEventFromViewersCommand)
export class RemoveEventFromViewersHandler implements ICommandHandler<RemoveEventFromViewersCommand, IDeleteEventResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}
    
    async execute(command: RemoveEventFromViewersCommand) {
        console.log(`${RemoveEventFromViewersHandler.name}`);
        
        const request = command.request;
    
        const data: IDeleteEvent ={
            managerId: request.managerId,
            eventId: request.eventId,
            Viewers: request.Viewers,
        }

        const event = this.publisher.mergeObjectContext(DeleteEvent.fromData(data));
        event.deleteFromViewers();
        event.commit();

        return { status : Status.SUCCESS };
    }
}