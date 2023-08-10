import { CreateEventEvent, Position } from '@event-participation-trends/api/event/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { IEvent } from "@event-participation-trends/api/event/util";
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { Types } from 'mongoose';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(CreateEventEvent)
export class CreateEventEventHandler implements IEventHandler<CreateEventEvent> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    ) {}

  async handle(event: CreateEventEvent) {
    console.log(`${CreateEventEventHandler.name}`);

    if(event.event.Manager != undefined){
        const ViewersArr: Types.ObjectId[] = new Array<Types.ObjectId>(event.event.Manager);
        const userDoc= await this.userRepository.getUserById(event.event.Manager);

        const eventToCreate : IEvent ={
            StartDate: new Date(event.event.StartDate || ""),
            EndDate: new Date(event.event.EndDate || ""),
            Name: event.event.Name,
            Category: event.event.Category,
            Location: event.event.Location,  
            FloorLayout: null,
            Stalls: null,
            Sensors: null,
            Devices: Array<Position>(),
            Manager: event.event.Manager,
            Requesters: new Array<Types.ObjectId>(), 
            Viewers: ViewersArr,
        }

        await this.eventRepository.createEvent(eventToCreate);

        //notify user via Email
        this.emailService.sendEmail(
            userDoc[0]?.Email || "", 
            EmailSubject.CREATE_EVENT,
            EmailContent.CREATE_EVENT_CONTENT+ event.event.Name + EmailContent.NEW_LINE + EmailContent.NEW_LINE +
            "Event Details: " + EmailContent.NEW_LINE +
            "\t Start Date: " + new Date(event.event.StartDate || "") + EmailContent.NEW_LINE +
            "\t End Date: " + new Date(event.event.EndDate || "") + EmailContent.NEW_LINE +
            "\t Event Name: " + event.event.Name + EmailContent.NEW_LINE +
            "\t Event Category: " + event.event.Category + EmailContent.NEW_LINE +
            "\t Event Location Details: " + event.event.Location + EmailContent.NEW_LINE
        )
    }
  }
}   