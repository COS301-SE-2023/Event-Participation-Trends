import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { RemoveEventFromViewerCommand, IRemoveViewer, IRemoveViewerResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { RemoveViewer } from '../models';
import { Types } from 'mongoose';

@CommandHandler(RemoveEventFromViewerCommand)
export class RemoveEventFromViewerHandler implements ICommandHandler<RemoveEventFromViewerCommand, IRemoveViewerResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}
    
    async execute(command: RemoveEventFromViewerCommand) {
        console.log(`${RemoveEventFromViewerHandler.name}`);
        
        const request = command.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
    
        const data: IRemoveViewer ={
            userEmail: request.userEmail,
            eventId: eventIdObj
        }

        const event = this.publisher.mergeObjectContext(RemoveViewer.fromData(data));
        event.removeEvent();
        event.commit();
        return { status : Status.SUCCESS };

    }
}