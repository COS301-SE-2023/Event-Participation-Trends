import { CreateWallEvent, IWall } from '@event-participation-trends/api/event/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { Types } from 'mongoose';

@EventsHandler(CreateWallEvent)
export class CreateWallEventandler implements IEventHandler<CreateWallEvent> {
  constructor(
    private readonly eventRepository: EventRepository
    ) {}

    async handle(event: CreateWallEvent) {
        console.log(`${CreateWallEventandler.name}`);
    
        const eventObjId = <Types.ObjectId> <unknown> event.event.eventId;

        if(event.event.Wall != null && event.event.Wall != undefined ){
            const WallToCreate : IWall= {
                wallId: new Types.ObjectId(),
                x_coordiante:event.event.Wall.x_coordiante,
                y_coordiante:event.event.Wall.y_coordiante,
                width:event.event.Wall.width,
                height:event.event.Wall.height,
            }
            await this.eventRepository.createWall(eventObjId,WallToCreate);
        }
        }
    
}
