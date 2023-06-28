import {
    ICreateEventRequest,
    ICreateEventResponse,
    CreateEventCommand,
    IGetAllEventsRequest,
    IGetAllEventsResponse,
    GetAllEventsQuery,
    IGetManagedEventsRequest,
    IGetManagedEventsResponse,
    GetManagedEventsQuery,
    ISendViewRequestRequest,
    ISendViewRequestResponse,
    SendViewRequestCommand,
    IGetAllViewRequestsRequest,
    IGetAllViewRequestsResponse,
    GetAllViewRequestsQuery,
    IDeclineViewRequestRequest,
    IDeclineViewRequestResponse,
    DeclineViewRequestCommand,
    IAcceptViewRequestRequest,
    IAcceptViewRequestResponse,
    AcceptViewRequestCommand,
    IGetUserViewingEventsRequest,
    IGetUserViewingEventsResponse,
    GetUserViewingEventsQuery,
    IRemoveViewerRequest,
    IRemoveViewerResponse,
    RemoveViewerFromEventCommand,
    IUpdateEventDetailsRequest,
    IUpdateEventDetailsResponse,
    UpdateEventDetailsCommand,
    IGetEventRequest,
    IGetEventResponse,
    GetEventQuery,
} from '@event-participation-trends/api/event/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class EventService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createEvent(request: ICreateEventRequest) {
        return await this.commandBus.execute<CreateEventCommand, ICreateEventResponse>(new CreateEventCommand(request));
    }

    async getAllEvent(request: IGetAllEventsRequest) {
        return await this.queryBus.execute<GetAllEventsQuery, IGetAllEventsResponse>(new GetAllEventsQuery(request));
    }

    async getManagedEvents(request: IGetManagedEventsRequest) {
        return await this.queryBus.execute<GetManagedEventsQuery, IGetManagedEventsResponse>(new GetManagedEventsQuery(request));
    }
    
    async sendViewRequest(request: ISendViewRequestRequest) {
        return await this.commandBus.execute<SendViewRequestCommand, ISendViewRequestResponse>(new SendViewRequestCommand(request));
    }

    async getAllViewRequests(request: IGetAllViewRequestsRequest) {
        return await this.queryBus.execute<GetAllViewRequestsQuery, IGetAllViewRequestsResponse>(new GetAllViewRequestsQuery(request));
    }
    
    async declineViewRequest(request: IDeclineViewRequestRequest) {
        return await this.commandBus.execute<DeclineViewRequestCommand, IDeclineViewRequestResponse>(new DeclineViewRequestCommand(request));
    }

    async acceptViewRequest(request: IAcceptViewRequestRequest) {
        return await this.commandBus.execute<AcceptViewRequestCommand, IAcceptViewRequestResponse>(new AcceptViewRequestCommand(request));
    }

    async getUserViewingEvents(request: IGetUserViewingEventsRequest) {
        return await this.queryBus.execute<GetUserViewingEventsQuery, IGetUserViewingEventsResponse>(new GetUserViewingEventsQuery(request));
    }

    async removeViewerFromEvent(request: IRemoveViewerRequest) {
        return await this.commandBus.execute<RemoveViewerFromEventCommand, IRemoveViewerResponse>(new RemoveViewerFromEventCommand(request));
    }

    async updateEventDetails(request: IUpdateEventDetailsRequest){
        return await this.commandBus.execute<UpdateEventDetailsCommand, IUpdateEventDetailsResponse>(new UpdateEventDetailsCommand(request));
    }

    async getEvent(request: IGetEventRequest) {
        return await this.queryBus.execute<GetEventQuery, IGetEventResponse>(new GetEventQuery(request));
    }
}