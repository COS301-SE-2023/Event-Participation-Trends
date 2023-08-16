import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { DeclineViewRequestCommand, IDeclineViewRequestResponse, IViewRequest } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { ViewRequest } from '../models';
import { Types } from 'mongoose';
import { HttpException } from '@nestjs/common';

@CommandHandler(DeclineViewRequestCommand)
export class DeclineViewRequestHandler implements ICommandHandler<DeclineViewRequestCommand, IDeclineViewRequestResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}
    
    async execute(command: DeclineViewRequestCommand) {
        console.log(`${DeclineViewRequestHandler.name}`);

        const request = command.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        //check if requester is manager of event
        const managerId = await this.eventRepository.getManager(eventIdObj);
        let managerDoc;
        if(managerId[0].Manager != undefined && managerId[0].Manager != null)
            managerDoc = await this.userRepository.getUserById(managerId[0].Manager);
        if(managerDoc && (request.managerEmail != managerDoc[0].Email)){
            throw new HttpException('Bad Request: managerEmail is not the event manager', 400);
        }

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
            event.decline();
            event.commit();
    
            return { status : Status.SUCCESS };
        }else{
            return { status : Status.FAILURE };
        }
    
    }
}