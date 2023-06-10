import { EventService } from '@event-participation-trends/api/event/feature';
import {
    ICreateEventRequest,
    ICreateEventResponse,
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
}