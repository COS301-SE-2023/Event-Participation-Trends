import { EventService } from '@event-participation-trends/api/event/feature';
import {
    ICreateEventRequest,
    ICreateEventResponse,
    IGetAllEventsRequest,
    IGetAllEventsResponse,
    IGetManagedEventsRequest,
    IGetManagedEventsResponse,
    ISendViewRequestRequest,
    ISendViewRequestResponse,
    IGetAllViewRequestsRequest,
    IGetAllViewRequestsResponse,
    IDeclineViewRequestRequest,
    IDeclineViewRequestResponse
} from '@event-participation-trends/api/event/util';
import { Body, Controller, Post, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { Request } from 'express';
import { IEventDetails, IEventId } from '@event-participation-trends/api/event/util';
import { JwtGuard } from '@event-participation-trends/api/guards';


@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}

    @Post('createEvent')
    @UseGuards(JwtGuard)
    async createEvent(
        @Req() req: Request,
        @Body() requestBody: IEventDetails,
    ): Promise<ICreateEventResponse> {
        const request: any =req;
        const extractRequest: ICreateEventRequest = {
            ManagerEmail: request.user['email'],
            Event: requestBody,
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
        @Req() req: Request,
        @Body() requestBody: IEventId,
    ): Promise<ISendViewRequestResponse> {
        const request: any =req;
        const extractRequest: ISendViewRequestRequest = {
            UserEmail: request.user["email"],
            eventId: requestBody.eventId,
        }
        return this.eventService.sendViewRequest(extractRequest);
    }

    @Get('getAllViewRequests')
    @UseGuards(JwtGuard)
    async getAllViewRequests(
        @Req() req: Request,
        @Query() query: any
    ): Promise<IGetAllViewRequestsResponse> {
        const request: any =req;
        const extractRequest: IGetAllViewRequestsRequest = {
            managerEmail: request.user["email"],
            eventId: query.eventId,
        }
        return this.eventService.getAllViewRequests(extractRequest);
    }

    @Post('declineViewRequest')
    @UseGuards(JwtGuard)
    async declineViewRequest(
        @Req() req: Request,
        @Body() requestBody: IDeclineViewRequestRequest,
    ): Promise<IDeclineViewRequestResponse> {
        const request: any =req;
        const extractRequest: IDeclineViewRequestRequest = {
            userEmail: requestBody.userEmail,
            eventId: requestBody.eventId,
        }
        return this.eventService.declineViewRequest(extractRequest);
    }
    
}