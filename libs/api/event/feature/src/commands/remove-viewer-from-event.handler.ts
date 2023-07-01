import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { RemoveViewerFromEventCommand, IRemoveViewer, IRemoveViewerResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { RemoveViewer } from '../models';
import { Types } from 'mongoose';

@CommandHandler(RemoveViewerFromEventCommand)
export class RemoveViewerFromEventHandler implements ICommandHandler<RemoveViewerFromEventCommand, IRemoveViewerResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
      ) {}
      
    async execute(command: RemoveViewerFromEventCommand) {
        console.log(`${RemoveViewerFromEventHandler.name}`);
        
        const request = command.request;

        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        const userDoc = await this.userRepository.getUser(request.userEmail || "");
        if(userDoc.length != 0){

            //ensure in Viewers array of event
            let viewer = false;
            const viewersDoc = await this.eventRepository.getViewers(eventIdObj);
            viewersDoc.forEach(element =>{
                if(element._id == eventIdObj)
                    viewer=true;
            })

            if(viewer){
                const data: IRemoveViewer ={
                    userEmail: request.userEmail,
                    eventId: eventIdObj
                }

                const event = this.publisher.mergeObjectContext(RemoveViewer.fromData(data));
                event.removeViewer();
                event.commit();
                return { status : Status.SUCCESS };
            }else{
                return { status : Status.FAILURE };
            }
        }else{
            return { status : Status.FAILURE };
        }
    
    }
}