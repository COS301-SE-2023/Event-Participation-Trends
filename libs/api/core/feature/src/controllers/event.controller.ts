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
    IDeclineViewRequestResponse,
    IAcceptViewRequestRequest,
    IAcceptViewRequestResponse,
    IGetUserViewingEventsRequest,
    IGetUserViewingEventsResponse,
    IRemoveViewerRequest,
    IRemoveViewerResponse,
    IUpdateEventDetailsRequest,
    IUpdateEventDetailsResponse,
} from '@event-participation-trends/api/event/util';
import { Body, Controller, Post, Get, UseGuards, Req, Query, SetMetadata, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { IEventDetails, IEventId } from '@event-participation-trends/api/event/util';
import { JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';


@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}

    @Post('createEvent')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard)
    async createEvent(
        @Req() req: Request,
        @Body() requestBody: IEventDetails,
    ): Promise<ICreateEventResponse> {
        const request: any =req;
        
        if(request.user['email']==undefined)
            throw new HttpException("Bad Request: Manager email not provided", 400);

        if(requestBody.StartDate == undefined || requestBody.StartDate ==null)
            throw new HttpException("Bad Request: Event StartDate not provided", 400);

        if(requestBody.EndDate == undefined || requestBody.EndDate ==null)
            throw new HttpException("Bad Request: Event EndDate not provided", 400);

        if(requestBody.Category == undefined || requestBody.Category ==null)
            throw new HttpException("Bad Request: Event Category not provided", 400);
        
        if(requestBody.Name == undefined || requestBody.Name ==null)
            throw new HttpException("Bad Request: Event Name not provided", 400);
        
        if(requestBody.Location == undefined || requestBody.Location ==null)
            throw new HttpException("Bad Request: Event Location not provided", 400);
            
        const extractRequest: ICreateEventRequest = {
            ManagerEmail: request.user['email'],
            Event: requestBody,
        }
       return this.eventService.createEvent(extractRequest);
    }

    @Get('getAllEvents')
    @SetMetadata('role',Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard)
    async getAllEvents(
        @Req() req: Request 
    ): Promise<IGetAllEventsResponse> {
        const request: any =req;

        if(request.user['email']==undefined || request.user['email']==null)
            throw new HttpException("Bad Request: Admin email not provided", 400);

        const extractRequest: IGetAllEventsRequest = {
            AdminEmail: request.user["email"],
        }
        return this.eventService.getAllEvent(extractRequest);
    }

    @Get('getManagedEvents')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard)
    async getManagedEvents(
        @Req() req: Request
    ): Promise<IGetManagedEventsResponse> {
        const request: any =req;

        if(request.user['email']==undefined || request.user['email']==null)
            throw new HttpException("Bad Request: Manager email not provided", 400);

        const extractRequest: IGetManagedEventsRequest = {
            ManagerEmail: request.user["email"],
        }
        return this.eventService.getManagedEvents(extractRequest);
    }

    @Post('sendViewRequest')
    @SetMetadata('role',Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard)
    async sendViewRequest(
        @Req() req: Request,
        @Body() requestBody: IEventId,
    ): Promise<ISendViewRequestResponse> {
        const request: any =req;

        if(request.user['email']==undefined || request.user['email']==null)
            throw new HttpException("Bad Request: viewer email not provided", 400);

        if(requestBody.eventId==undefined || requestBody.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);

        const extractRequest: ISendViewRequestRequest = {
            UserEmail: request.user["email"],
            eventId: requestBody.eventId,
        }
        return this.eventService.sendViewRequest(extractRequest);
    }

    @Get('getAllViewRequests')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard)
    async getAllViewRequests(
        @Req() req: Request,
        @Query() query: any
    ): Promise<IGetAllViewRequestsResponse> {
        const request: any =req;

        if(request.user['email']==undefined || request.user['email']==null)
        throw new HttpException("Bad Request: manager email not provided", 400);

        if(query.eventId==undefined || query.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);


        const extractRequest: IGetAllViewRequestsRequest = {
            managerEmail: request.user["email"],
            eventId: query.eventId,
        }
        return this.eventService.getAllViewRequests(extractRequest);
    }

    @Post('declineViewRequest')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard)
    async declineViewRequest(
        @Body() requestBody: IDeclineViewRequestRequest,
    ): Promise<IDeclineViewRequestResponse> {
        
        if(requestBody.userEmail==undefined || requestBody.userEmail==null)
            throw new HttpException("Bad Request: viewer email not provided", 400);

        if(requestBody.eventId==undefined || requestBody.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);

        const extractRequest: IDeclineViewRequestRequest = {
            userEmail: requestBody.userEmail,
            eventId: requestBody.eventId,
        }
        return this.eventService.declineViewRequest(extractRequest);
    }
    
    @Post('acceptViewRequest')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard)
    async acceptViewRequest(
        @Body() requestBody: IAcceptViewRequestRequest,
    ): Promise<IAcceptViewRequestResponse> {
        const extractRequest: IAcceptViewRequestRequest = {
            userEmail: requestBody.userEmail,
            eventId: requestBody.eventId,
        }
        return this.eventService.acceptViewRequest(extractRequest);
    }

    @Get('getAllViewingEvents')
    @SetMetadata('role',Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard)
    async getAllViewingEvents(
        @Req() req: Request,
    ): Promise<IGetUserViewingEventsResponse> {
        const request: any =req;
        const extractRequest: IGetUserViewingEventsRequest = {
            userEmail: request.user["email"],
        }
        return this.eventService.getUserViewingEvents(extractRequest);
    }

    @Post('removeViewerFromEvent')
    @SetMetadata('role',Role.MANAGER)
    async removeViewerFromEvent(
        @Body() requestBody: IRemoveViewerRequest,
    ): Promise<IRemoveViewerResponse> {
        const extractRequest: IRemoveViewerRequest = {
            userEmail: requestBody.userEmail,
            eventId: requestBody.eventId
        }
        return this.eventService.removeViewerFromEvent(extractRequest);
    }

    @Post('updateEventDetails')
    @SetMetadata('role',Role.MANAGER)
    async updateEventDetails(
        @Body() requestBody: IUpdateEventDetailsRequest,
    ): Promise<IUpdateEventDetailsResponse> {
        const extractRequest: IUpdateEventDetailsRequest = {
            eventId: requestBody.eventId,
            eventDetails: requestBody.eventDetails,
        }
        return this.eventService.updateEventDetails(extractRequest);
    }

}