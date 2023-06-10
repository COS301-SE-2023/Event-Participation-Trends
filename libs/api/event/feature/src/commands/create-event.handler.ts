import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { CreateEventCommand, IEventDetails, ICreateEventResponse } from '@event-participation-trends/api/event/util';
import { Status, Role } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventDetails } from '../models';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand, ICreateEventResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
      ) {}
    
    async execute(command: CreateEventCommand) {
        console.log(`${CreateEventHandler.name}`);

        const request = command.request;

        if (!request.ManagerEmail || !request.Event)
            throw new Error('Missing required field');

        //check user exists
        const managerDoc= await this.userRepository.getUser(request.ManagerEmail || "");
        if(managerDoc.length == 0)
            throw new Error(`User with email ${request.ManagerEmail} does not exist`);

        //check if email is a manager email
        if(managerDoc[0].Role != Role.MANAGER && managerDoc[0].Role != Role.ADMIN)
            throw new Error(`User with eamil ${request.ManagerEmail} does not have manager privileges`);

        const data: IEventDetails = {
            StartDate: request.Event.StartDate,
            EndDate: request.Event.EndDate,
            Name: request.Event.Name,
            Category: request.Event.Category,
            Location: request.Event.Location,
            Manager: managerDoc[0]._id,
        }
    
        const event = this.publisher.mergeObjectContext(EventDetails.fromData(data));
        event.create();
        event.commit();

        return { status : Status.SUCCESS };  
    }
}