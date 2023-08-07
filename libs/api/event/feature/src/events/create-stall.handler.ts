import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { CreateStallEvent } from "@event-participation-trends/api/event/util";
import { UserRepository } from "@event-participation-trends/api/user/data-access";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

@EventsHandler(CreateStallEvent)
export class CreateStallEventHandler implements IEventHandler<CreateStallEvent> {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async handle(event: CreateStallEvent) {
        console.log(`${CreateStallEventHandler.name}`);

        if(event.event.Name != undefined){
            const stallToCreate = {
                EventId: event.event.EventId,
                Name: event.event.Name,
                x_coordinate: event.event.x_coordinate,
                y_coordinate: event.event.y_coordinate,
                width: event.event.width,
                height: event.event.height
            };
            await this.eventRepository.createStall(stallToCreate);
        }
    }

}