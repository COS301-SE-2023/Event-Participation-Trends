import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { AddViewingEventCommand, IAddViewingEventResponse, IAddViewEvent } from '@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddViewEvent } from '../models';
import { Status } from'@event-participation-trends/api/user/util';

@CommandHandler(AddViewingEventCommand)
export class AddViewingEventHandler implements ICommandHandler<AddViewingEventCommand, IAddViewingEventResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
      ) {}

    async execute(command: AddViewingEventCommand) {
        console.log(`${AddViewingEventHandler.name}`);
    
        const request = command.request.request;

        const data: IAddViewEvent ={
            userEmail: request.userEmail,
            eventId: request.eventId
        }

        const addViewEvent = this.publisher.mergeObjectContext(AddViewEvent.fromData(data));
        addViewEvent.add();
        addViewEvent.commit();
        
        return { status : Status.SUCCESS };
    }
    
}