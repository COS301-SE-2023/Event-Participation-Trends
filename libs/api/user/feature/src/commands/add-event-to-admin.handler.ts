import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { AddEventToAdminCommand, IAddEventToAdminResponse, IAddViewEvent } from '@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddViewEvent } from '../models';
import { Status } from '@event-participation-trends/api/user/util';
import { promisify } from 'util';

@CommandHandler(AddEventToAdminCommand)
export class AddEventToAdminHandler implements ICommandHandler<AddEventToAdminCommand, IAddEventToAdminResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
      ) {}

    async execute(command: AddEventToAdminCommand) {
        console.log(`${AddEventToAdminHandler.name}`);
    
        const request = command.request;
        const sleep = promisify(setTimeout);

        let eventDoc = await this.eventRepository.getEventByName(request.eventName);
        
        //in case event not created yet
        while(eventDoc.length == 0){  
            await sleep(2000);
            eventDoc = await this.eventRepository.getEventByName(request.eventName);
        }
        
        if(eventDoc.length != 0){

            const data: IAddViewEvent ={
                userEmail: "",
                eventId: <string> <unknown> eventDoc[0]._id
            }

            const addViewEvent = this.publisher.mergeObjectContext(AddViewEvent.fromData(data));
            addViewEvent.addToAdmin();
            addViewEvent.commit();
            
            return { status : Status.SUCCESS };
        }else {
            return { status : Status.FAILURE };
        }


    }
    
}