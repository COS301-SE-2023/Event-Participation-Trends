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
    IGetEventRequest,
    IGetEventResponse,
    IUpdateFloorlayoutRequest,
    IUpdateFloorlayoutResponse,
    IGetEventFloorlayoutRequest,
    IGetEventFloorlayoutResponse,
    IAddViewerRequest,
    IAddViewerResponse,
    IGetEventDevicePositionRequest,
    IGetEventDevicePositionResponse,
    IGetAllEventCategoriesResponse,
    IGetManagedEventCategoriesResponse,
    IGetManagedEventCategoriesRequest,
    IGetFloorplanBoundariesResponse,
    IGetFloorplanBoundariesRequest,
    IDeleteEventRequest,
    IDeleteEventResponse,
} from '@event-participation-trends/api/event/util';
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Query,
  SetMetadata,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  IEventDetails,
  IEventId,
  EventDefualts,
} from '@event-participation-trends/api/event/util';
import {
  CsrfGuard,
  JwtGuard,
  RbacGuard,
} from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';
import moment from 'moment';

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
  ) {}

  @Post('createEvent')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async createEvent(
    @Req() req: Request,
    @Body() requestBody: IEventDetails
  ): Promise<ICreateEventResponse> {
    const request: any = req;

    if (request.user['email'] == undefined)
      throw new HttpException('Bad Request: Manager email not provided', 400);

    if (requestBody.Name == undefined || requestBody.Name == null)
      throw new HttpException('Bad Request: Event Name not provided', 400);

    if (requestBody.StartDate == undefined || requestBody.StartDate == null)
        requestBody.StartDate = computePreviousDayDate();

    if (requestBody.EndDate == undefined || requestBody.EndDate == null)
        requestBody.EndDate = computeNextWeekDate();

    if (requestBody.Category == undefined || requestBody.Category == null)
        requestBody.Category = EventDefualts.CATEGORY;

    if (requestBody.Location == undefined || requestBody.Location == null)
        requestBody.Location = EventDefualts.LOCATION;

    if(requestBody.PublicEvent == undefined || requestBody.PublicEvent == null )
        requestBody.PublicEvent = EventDefualts.PUBLIC_EVENT == 0? false: true;

    console.log(requestBody)

    const extractRequest: ICreateEventRequest = {
      ManagerEmail: request.user['email'],
      Event: requestBody,
    };
    return this.eventService.createEvent(extractRequest);
  }

  @Get('getAllEvents')
  @SetMetadata('role', Role.VIEWER)
  @UseGuards(JwtGuard,RbacGuard, CsrfGuard)
  async getAllEvents(@Req() req: Request): Promise<IGetAllEventsResponse> {
    const request: any = req;

    const extractRequest: IGetAllEventsRequest = {
      AdminEmail: request.user['email'],
    };
    return this.eventService.getAllEvent(extractRequest);
  }

  @Get('getAllActiveEvents')
  @SetMetadata('role', Role.VIEWER)
  @UseGuards(JwtGuard,RbacGuard, CsrfGuard)
  async getAllActiveEvents(): Promise<IGetAllEventsResponse> {

    return this.eventService.getAllActiveEvents();
  }

  @Get('getManagedEvents')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async getManagedEvents(
    @Req() req: Request
  ): Promise<IGetManagedEventsResponse> {
    const request: any = req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: Manager email not provided', 400);

    const extractRequest: IGetManagedEventsRequest = {
      ManagerEmail: request.user['email'],
    };
    return this.eventService.getManagedEvents(extractRequest);
  }

  @Post('sendViewRequest')
  @SetMetadata('role', Role.VIEWER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async sendViewRequest(
    @Req() req: Request,
    @Body() requestBody: IEventId
  ): Promise<ISendViewRequestResponse> {
    const request: any = req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: viewer email not provided', 400);

    if (requestBody.eventId == undefined || requestBody.eventId == null)
      throw new HttpException('Bad Request: eventId not provided', 400);

    const extractRequest: ISendViewRequestRequest = {
      UserEmail: request.user['email'],
      eventId: requestBody.eventId,
    };
    return this.eventService.sendViewRequest(extractRequest);
  }

  @Get('getAllViewRequests')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async getAllViewRequests(
    @Req() req: Request,
    @Query() query: any
  ): Promise<IGetAllViewRequestsResponse> {
    const request: any = req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: manager email not provided', 400);

    if (query.eventId == undefined || query.eventId == null)
      throw new HttpException('Bad Request: eventId not provided', 400);

    const extractRequest: IGetAllViewRequestsRequest = {
      managerEmail: request.user['email'],
      eventId: query.eventId,
    };
    return this.eventService.getAllViewRequests(extractRequest);
  }

  @Post('declineViewRequest')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async declineViewRequest(
    @Req() req: Request,
    @Body() requestBody: IDeclineViewRequestRequest
  ): Promise<IDeclineViewRequestResponse> {
    const request: any = req;

    if (requestBody.userEmail == undefined || requestBody.userEmail == null)
      throw new HttpException('Bad Request: viewer email not provided', 400);

    if (requestBody.eventId == undefined || requestBody.eventId == null)
      throw new HttpException('Bad Request: eventId not provided', 400);

    const extractRequest: IDeclineViewRequestRequest = {
      managerEmail: request.user['email'],
      userEmail: requestBody.userEmail,
      eventId: requestBody.eventId,
    };
    return this.eventService.declineViewRequest(extractRequest);
  }

  @Post('acceptViewRequest')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async acceptViewRequest(
    @Body() requestBody: IAcceptViewRequestRequest
  ): Promise<IAcceptViewRequestResponse> {
    if (requestBody.userEmail == undefined || requestBody.userEmail == null)
      throw new HttpException('Bad Request: viewer email not provided', 400);

    if (requestBody.eventId == undefined || requestBody.eventId == null)
      throw new HttpException('Bad Request: eventId not provided', 400);

    const extractRequest: IAcceptViewRequestRequest = {
      userEmail: requestBody.userEmail,
      eventId: requestBody.eventId,
    };
    return this.eventService.acceptViewRequest(extractRequest);
  }

    @Get('getAllViewingEvents')
    @SetMetadata('role',Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getAllViewingEvents(
        @Req() req: Request,
    ): Promise<IGetUserViewingEventsResponse> {
        const request: any =req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: viewer email not provided', 400);

    const extractRequest: IGetUserViewingEventsRequest = {
      userEmail: request.user['email'],
    };
    return this.eventService.getUserViewingEvents(extractRequest);
  }

    @Post('removeViewerFromEvent')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async removeViewerFromEvent(
        @Body() requestBody: IRemoveViewerRequest,
    ): Promise<IRemoveViewerResponse> {

    if (requestBody.eventId == undefined || requestBody.eventId == null)
      throw new HttpException('Bad Request: eventId not provided', 400);

    const extractRequest: IRemoveViewerRequest = {
      userEmail: requestBody.userEmail,
      eventId: requestBody.eventId,
    };
    return this.eventService.removeViewerFromEvent(extractRequest);
  }

    @Post('updateEventDetails')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async updateEventDetails(
        @Body() requestBody: IUpdateEventDetailsRequest,
    ): Promise<IUpdateEventDetailsResponse> {

        if(requestBody.eventId==undefined || requestBody.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);

    const extractRequest: IUpdateEventDetailsRequest = {
      eventId: requestBody.eventId,
      eventDetails: requestBody.eventDetails,
    };
    return this.eventService.updateEventDetails(extractRequest);
  }

    @Get('getEvent')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getEvent(
        @Query() query: any
    ): Promise<IGetEventResponse> {

        if(query.eventId==undefined || query.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);

    const extractRequest: IGetEventRequest = {
      eventId: query.eventId,
    };

    return <IGetEventResponse>(
      (<unknown>this.eventService.getEvent(extractRequest))
    );
  }

  @Post('updateEventFloorlayout')
  @SetMetadata('role',Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async updateEventFloorlayout(
    @Body() requestBody: IUpdateFloorlayoutRequest
  ): Promise<IUpdateFloorlayoutResponse> {

    if(requestBody.eventId==undefined || requestBody.eventId ==null)
        throw new HttpException("Bad Request: eventId not provided", 400);

    if(requestBody.floorlayout==undefined || requestBody.floorlayout ==null)
        throw new HttpException("Bad Request: floorlayout not provided", 400);

    const extractRequest: IUpdateFloorlayoutRequest = {
        eventId: requestBody.eventId,
        floorlayout: requestBody.floorlayout,
    };

    return <IUpdateFloorlayoutResponse>(
        (<unknown>this.eventService.updateEventFloorLayout(extractRequest))
    );
  }

  @Post('deleteEvent')
  @SetMetadata('role',Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async deleteEvent(
    @Req() req: Request,
    @Body() requestBody: IEventId
  ): Promise<IDeleteEventResponse> {
    const request: any = req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: viewer email not provided', 400);

    if(requestBody.eventId==undefined || requestBody.eventId ==null)
        throw new HttpException("Bad Request: eventId not provided", 400);


    const extractRequest: IDeleteEventRequest = {
        managerEmail: request.user['email'],
        eventId: requestBody.eventId,
    };

    return <IDeleteEventResponse>(
        (<unknown>this.eventService.deleteEvent(extractRequest))
    );
  }

  @Get('getEventFloorLayout')
  @SetMetadata('role',Role.VIEWER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async getEventFloorLayout(
      @Query() query: any
  ): Promise<IGetEventFloorlayoutResponse> {

    if(query.eventId==undefined || query.eventId ==null)
          throw new HttpException("Bad Request: eventId not provided", 400);

  const extractRequest: IGetEventFloorlayoutRequest = {
    eventId: query.eventId,
  };

  return <IGetEventFloorlayoutResponse>(
    (<unknown>this.eventService.getEventFloorLayout(extractRequest))
  );
 }

  @Get('getFloorplanBoundaries')
  @SetMetadata('role',Role.VIEWER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async getFloorplanCenter(
      @Query() query: any
  ): Promise<IGetFloorplanBoundariesResponse> {

    if(query.eventId==undefined || query.eventId ==null)
      throw new HttpException("Bad Request: eventId not provided", 400);
    
    // if(query.floorplanId==undefined || query.floorplanId ==null)
    //   throw new HttpException("Bad Request: floorplanId not provided", 400);

    const extractRequest: IGetFloorplanBoundariesRequest = {
      eventId: query.eventId
    };

    return <IGetFloorplanBoundariesResponse>(
      (<unknown>this.eventService.getFloorplanBoundaries(extractRequest))
    );
  }

 
    @Post('addEventViewer')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async addEventViewer(
    @Body() requestBody: IAddViewerRequest
    ): Promise<IAddViewerResponse> {

    if(requestBody.eventId==undefined || requestBody.eventId ==null)
        throw new HttpException("Bad Request: eventId not provided", 400);

    if(requestBody.userEmail==undefined || requestBody.userEmail ==null)
        throw new HttpException("Bad Request: userEmail not provided", 400);

    const extractRequest: IAddViewerRequest = {
            userEmail: requestBody.userEmail,
            eventId: requestBody.eventId,
    };

    return <IAddViewerResponse>(
        (<unknown>this.eventService.addEventViewer(extractRequest))
    );
    }

    @Get('getEventDevicePosition')
    @SetMetadata('role',Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getEventDevicePosition(
        @Query() query: any
    ): Promise<IGetEventDevicePositionResponse> {
  
        if(query.eventId==undefined || query.eventId ==null)
            throw new HttpException("Bad Request: eventId not provided", 400);
    
        if(query.startTime==undefined || query.startTime ==null)
            throw new HttpException("Bad Request: startDate not provided", 400);
        
        if(query.endTime==undefined || query.endTime ==null)
            throw new HttpException("Bad Request: endDate not provided", 400);

        const extractRequest: IGetEventDevicePositionRequest = {
            eventId: query.eventId,
            startTime: query.startTime,
            endTime: query.endTime
        };
  
        return <IGetEventDevicePositionResponse><unknown>(
            this.eventService.getEventDevicePosition(extractRequest));
   }

  @Get('getAllEventCategories')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard,RbacGuard, CsrfGuard)
  async getAllEventCategories(): Promise<IGetAllEventCategoriesResponse> {

    return this.eventService.getAllEventCategories();
  }

  @Get('getManagedEventCategories')
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard,RbacGuard, CsrfGuard)
  async getManagedEventCategories(@Req() req: Request ): Promise<IGetManagedEventCategoriesResponse> {
    const request: any = req;

    if (request.user['email'] == undefined || request.user['email'] == null)
      throw new HttpException('Bad Request: Manager email not provided', 400);

    const extractRequest: IGetManagedEventCategoriesRequest = {
      ManagerEmail: request.user['email'],
    };
    return this.eventService.getManagedEventCategories(extractRequest);
  }



}

function computePreviousDayDate(): Date{
    const currentDate = moment(); 
    const dayBefore = currentDate.subtract(1, 'day');
    return new Date(dayBefore.format('YYYY-MM-DD'));
}

function computeNextWeekDate(): Date{
    const currentDate = moment(); 
    const nextWeek = currentDate.add(6, 'day');
    return new Date(nextWeek.format('YYYY-MM-DD'));
}