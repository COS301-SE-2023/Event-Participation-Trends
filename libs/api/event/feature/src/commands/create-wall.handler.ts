import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { CreateWallCommand, ICreateWall, ICreateWallResponse } from '@event-participation-trends/api/event/util';
import { Status } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateWall } from '../models';
import { Types } from 'mongoose';

@CommandHandler(CreateWallCommand)
export class CreateWallHandler implements ICommandHandler<CreateWallCommand, ICreateWallResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
      ) {}
    
    async execute(command: CreateWallCommand) {
        console.log(`${CreateWallHandler.name}`);

        const request = command.request;
        if(request.eventId != null && request.eventId != undefined){

            const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
            //check if event already exists
            let eventExists =false;
            const checkDoc = await this.eventRepository.getEventById(eventIdObj);
            if(checkDoc.length != 0)
                eventExists =true;

            if(eventExists){
                const data: ICreateWall = {
                    eventId: request.eventId,
                    Wall: request.Wall,
                }
                
                const event = this.publisher.mergeObjectContext(CreateWall.fromData(data));
                event.create();
                event.commit();
        
                return { status : Status.SUCCESS };
            }  else{
                return { status : Status.FAILURE };
            }
        }else{
            return { status : Status.FAILURE };
        }
    }
}