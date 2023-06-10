import { EventService } from '@event-participation-trends/api/event/feature';
import {
    ICreateEventRequest,
    ICreateEventResponse,
    IGetAllEventsRequest,
    IGetAllEventsResponse,
    IGetManagedEventsRequest,
    IGetManagedEventsResponse,
} from '@event-participation-trends/api/event/util';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}

    @Post('createEvent')
    async createEvent(
        @Body() request: ICreateEventRequest,
    ): Promise<ICreateEventResponse> {
        return this.eventService.createEvent(request);
    }

    @Post('getAllEvents')
    async getAllEvents(
        @Body() request: IGetAllEventsRequest,
    ): Promise<IGetAllEventsResponse> {
        return this.eventService.getAllEvent(request);
    }

    @Post('getManagedEvents')
    async getManagedEvents(
        @Body() request: IGetManagedEventsRequest,
    ): Promise<IGetManagedEventsResponse> {
        return this.eventService.getManagedEvents(request);
    }
    
}