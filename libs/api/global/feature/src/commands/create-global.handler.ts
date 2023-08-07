import { CreateGlobalCommand, IGlobal, ICreateGlobalResponse } from '@event-participation-trends/api/global/util';
import { Status } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Global } from '../models';

@CommandHandler(CreateGlobalCommand)
export class CreateGlobalHandler implements ICommandHandler<CreateGlobalCommand, ICreateGlobalResponse> {
    constructor(
        private readonly publisher: EventPublisher,
      ) {}
    
    async execute(command: CreateGlobalCommand) {
        console.log(`${CreateGlobalHandler.name}`);

        const request = command.request;
        const data: IGlobal={
            SensorIdToMacs: request.sensorIdToMacs,
        }

        const event = this.publisher.mergeObjectContext(Global.fromData(data));
        event.create();
        event.commit();
        return { status : Status.SUCCESS };

    }
}