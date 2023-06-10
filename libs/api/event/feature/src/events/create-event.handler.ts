import { CreateEventEvent } from '@event-participation-trends/api/event/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { IEvent } from "@event-participation-trends/api/event/util";
import { EventRepository } from '@event-participation-trends/api/event/data-access';

@EventsHandler(CreateEventEvent)
export class CreateEventEventHandler implements IEventHandler<CreateEventEvent> {
  constructor(private readonly repository: EventRepository) {}

  async handle(event: CreateEventEvent) {
    console.log(`${CreateEventEventHandler.name}`);

    const eventToCreate : IEvent ={
        StartDate: new Date(event.event.StartDate || ""),
        EndDate: new Date(event.event.StartDate || ""),
        Name: event.event.Name,
        Category: event.event.Category,
        Location: event.event.Location,  
        thisFloorLayout: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        BTIDtoDeviceBuffer: null,
        TEMPBuffer: null,
        Manager: event.event.Manager,
        Requesters: null,
        Viewers: null,
    }

    await this.repository.createEvent(eventToCreate);
  }
}   