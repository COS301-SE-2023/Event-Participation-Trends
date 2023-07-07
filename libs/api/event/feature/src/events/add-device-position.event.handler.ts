import { IAddDevicePosition, AddDevicePositionEvent, Position } from '@event-participation-trends/api/event/util';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

@EventsHandler(AddDevicePositionEvent)
export class AddDevicePositionEventHandler implements IEventHandler<AddDevicePositionEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: AddDevicePositionEvent) {
        console.log(`${AddDevicePositionEventHandler.name}`);
        
        const request = <IAddDevicePosition> event.event;
        const eventIdObj = <Types.ObjectId> <unknown> event.event.eventId;

        if(request.eventId != null){
            await this.eventRepository.addDevicePosition(eventIdObj, <Position> request.position);
        }
    }
    
}