import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { DatabaseService } from '@event-participation-trends/api/database/feature';
import { AcceptViewRequestCommand, IAcceptViewRequestResponse, IViewRequest } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { ViewRequest } from '../models';
import { Types } from 'mongoose';

@CommandHandler(AcceptViewRequestCommand)
export class AcceptViewRequestHandler implements ICommandHandler<AcceptViewRequestCommand, IAcceptViewRequestResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
        private readonly databaseService: DatabaseService,
      ) {}

    async execute(command: AcceptViewRequestCommand) {
        console.log(`${AcceptViewRequestHandler.name}`);

        const request = command.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        //check if requester is manager of event or Admin
        if(!(await this.databaseService.checkManagerOrAdmin(eventIdObj,request.managerEmail || "")))
            return { status : Status.FAILURE };

        //check if request exists
        const userDoc = await this.userRepository.getUser(request.userEmail|| "");
        let requested =false;
        const eventRequestersDoc = await this.eventRepository.getRequesters(eventIdObj);
        if(eventRequestersDoc.length != 0)
            eventRequestersDoc[0].Requesters?.forEach(element => {
                if(element.toString() == userDoc[0]._id.toString())
                    requested =true;
            });

        if(requested){
            const data: IViewRequest={
                userEmail: request.userEmail,
                eventId: eventIdObj
            }

            const event = this.publisher.mergeObjectContext(ViewRequest.fromData(data));
            event.accept();
            event.commit();

                return { status : Status.SUCCESS };
            }else{
                return { status : Status.FAILURE };
            }
    }

}