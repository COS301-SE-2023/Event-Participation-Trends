import { EventService } from '@event-participation-trends/api/event/feature';
import {
    ICreateEventRequest,
    ICreateEventResponse,
    IGetAllEventsRequest,
    IGetAllEventsResponse,
    IGetManagedEventsRequest,
    IGetManagedEventsResponse,
    ISendViewRequestRequest,
    ISendViewRequestResponse
} from '@event-participation-trends/api/event/util';
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '@event-participation-trends/guards';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}

    @Post('createEvent')
    @UseGuards(JwtGuard)
    async createEvent(
        @Req() req: Request
    ): Promise<ICreateEventResponse> {
        const request: any =req;
        const extractRequest: ICreateEventRequest = {
            ManagerEmail: request.user['email'],
            Event: request.body['Event']
        }
        return this.eventService.createEvent(extractRequest);
    }

    @Get('getAllEvents')
    @UseGuards(JwtGuard)
    async getAllEvents(
        @Req() req: Request 
    ): Promise<IGetAllEventsResponse> {
        const request: any =req;
        const extractRequest: IGetAllEventsRequest = {
            AdminEmail: request.user["email"],
        }
        return this.eventService.getAllEvent(extractRequest);
    }

    @Get('getManagedEvents')
    @UseGuards(JwtGuard)
    async getManagedEvents(
        @Req() req: Request
    ): Promise<IGetManagedEventsResponse> {
        const request: any =req;
        const extractRequest: IGetManagedEventsRequest = {
            ManagerEmail: request.user["email"],
        }
        return this.eventService.getManagedEvents(extractRequest);
    }

    @Post('sendViewRequest')
    @UseGuards(JwtGuard)
    async sendViewRequest(
        @Req() req: Request
    ): Promise<ISendViewRequestResponse> {
        const request: any =req;
        const extractRequest: ISendViewRequestRequest = {
            UserEmail: request.user["email"],
            eventId: request.body["eventId"]
        }
        return this.eventService.sendViewRequest(extractRequest);
    }
    
}