import { AddDevicePositionCommand, IAddDevicePosition, IAddDevicePositionResponse } from '@event-participation-trends/api/event/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Status } from'@event-participation-trends/api/user/util';
import { AddDevicePosition } from '../models';

@CommandHandler(AddDevicePositionCommand)
export class AddDevicePositionHandler implements ICommandHandler<AddDevicePositionCommand, IAddDevicePositionResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}

    async execute(command: AddDevicePositionCommand) {
        console.log(`${AddDevicePositionHandler.name}`);
        
        const request = command.request; 

        const data: IAddDevicePosition={
            eventId: request.eventId,
            position: request.position,
        }
    
        const event = this.publisher.mergeObjectContext(AddDevicePosition.fromData(data));
        event.add();
        event.commit();

        return { status : Status.SUCCESS };
    }
}