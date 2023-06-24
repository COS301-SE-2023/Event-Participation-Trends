import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { SendViewRequestCommand, IViewEvent, ISendViewRequestResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { ViewEvent } from '../models';
import { Types } from 'mongoose';
import { HttpException } from '@nestjs/common';

@CommandHandler(SendViewRequestCommand)
export class SendViewRequestHandler implements ICommandHandler<SendViewRequestCommand, ISendViewRequestResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}

    async execute(command: SendViewRequestCommand) {
        console.log(`${SendViewRequestHandler.name}`);
        
        const request = command.request;

        if (!request.eventId){
                
            const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

            const eventDoc = await this.eventRepository.getEventById(eventIdObj);
            if(eventDoc.length == 0)
                throw new HttpException(`Bad Request: event with eventID ${request.eventId} does not exist in DB`, 400);

            //check if already requested
            const userDoc = await this.userRepository.getUser(request.UserEmail|| "");
            let requested =false;
            const eventRequestersDoc = await this.eventRepository.getRequesters(eventIdObj);
            if(eventRequestersDoc.length != 0)
                eventRequestersDoc[0].Requesters?.forEach(element => {
                    if(element.toString() == userDoc[0]._id.toString())
                        requested =true; 
                });

            if(!requested){
                const data: IViewEvent = {
                    UserEmail: request.UserEmail,
                    eventId: eventIdObj
                }
    
                const event = this.publisher.mergeObjectContext(ViewEvent.fromData(data));
                event.create();
                event.commit();
    
                return { status : Status.SUCCESS };
            }else {
                return { status : Status.FAILURE };
            }
        }else{
            return { status : Status.FAILURE };
        }
 
    }
}