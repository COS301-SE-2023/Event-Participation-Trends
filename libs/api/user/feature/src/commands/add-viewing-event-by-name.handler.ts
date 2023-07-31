import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { AddViewingEventByNameCommand, IAddViewingEventByNameResponse, IAddViewEvent } from '@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddViewEvent } from '../models';
import { Status } from '@event-participation-trends/api/user/util';
import { promisify } from 'util';

@CommandHandler(AddViewingEventByNameCommand)
export class AddViewingEventByNameHandler implements ICommandHandler<AddViewingEventByNameCommand, IAddViewingEventByNameResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}

    async execute(command: AddViewingEventByNameCommand) {
        console.log(`${AddViewingEventByNameHandler.name}`);
    
        const request = command.request;
        const sleep = promisify(setTimeout);


        let eventDoc = await this.eventRepository.getEventByName(request.eventName);
        
        //in case event not created yet
        while(eventDoc.length == 0){  
            await sleep(2000);
            eventDoc = await this.eventRepository.getEventByName(request.eventName);
        }
        
        if(eventDoc.length != 0){

            if(eventDoc[0].Manager != null && eventDoc[0].Manager != undefined){
                const userDoc = await this.userRepository.getUserById(eventDoc[0].Manager)
                
                const data: IAddViewEvent ={
                    userEmail: userDoc[0]?.Email || "",
                    eventId: <string> <unknown> eventDoc[0]._id
                }

                const addViewEvent = this.publisher.mergeObjectContext(AddViewEvent.fromData(data));
                addViewEvent.add();
                addViewEvent.commit();
                
                return { status : Status.SUCCESS };
            }else{
                return { status : Status.FAILURE };
            }
        }else {
            return { status : Status.FAILURE };
        }


    }
    
}