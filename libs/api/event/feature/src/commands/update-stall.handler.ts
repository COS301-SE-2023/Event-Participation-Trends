import { IUpdateStallResponse, UpdateStallCommand } from "@event-participation-trends/api/event/util";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateStall } from "../models";
import { Status } from "@event-participation-trends/api/user/util";

@CommandHandler(UpdateStallCommand)
export class UpdateStallHandler implements ICommandHandler<UpdateStallCommand, IUpdateStallResponse> {
    constructor(
        private readonly publisher: EventPublisher,
    ) {}

    async execute(command: UpdateStallCommand) {
        console.log(`${UpdateStallHandler.name}`);

        const request = command.request;

        const data = {
            EventId: request.eventId,
            Name: request.stall.Name,
            x_coordinate: request.stall.x_coordinate,
            y_coordinate: request.stall.y_coordinate,
            width: request.stall.width,
            height: request.stall.height,
        }

        const event = this.publisher.mergeObjectContext(UpdateStall.fromData(data));
        event.update();
        event.commit();

        return { status : Status.SUCCESS };
    }
}