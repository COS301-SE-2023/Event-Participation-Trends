import { CreateEventEvent, MqttData } from '@event-participation-trends/api/event/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { IEvent } from "@event-participation-trends/api/event/util";
import { EventRepository, MacToId } from '@event-participation-trends/api/event/data-access';
import { Types } from 'mongoose';

@EventsHandler(CreateEventEvent)
export class CreateEventEventHandler implements IEventHandler<CreateEventEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    ) {}

  async handle(event: CreateEventEvent) {
    console.log(`${CreateEventEventHandler.name}`);

    if(event.event.Manager != undefined){
        const ViewersArr: Types.ObjectId[] = new Array<Types.ObjectId>(event.event.Manager);

        const eventToCreate : IEvent ={
            StartDate: new Date(event.event.StartDate || ""),
            EndDate: new Date(event.event.EndDate || ""),
            Name: event.event.Name,
            Category: event.event.Category,
            Location: event.event.Location,  
            //thisFloorLayout: null,
            Stalls: null,
            Sensors: null,
            Devices: null,
            BTIDtoDeviceBuffer: Array<MacToId>(),
            TEMPBuffer: Array<MqttData>(),
            Manager: event.event.Manager,
            Requesters: new Array<Types.ObjectId>(), 
            Viewers: ViewersArr,
        }

        await this.eventRepository.createEvent(eventToCreate);
    }
  }
}   