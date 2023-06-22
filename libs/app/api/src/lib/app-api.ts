import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IGetUsersResponse, IUpdateRoleRequest, IUser, IupdateRoleResponse } from "@event-participation-trends/api/user/util";
import { IAcceptViewRequestRequest, IAcceptViewRequestResponse, ICreateEventResponse, IDeclineViewRequestRequest, IDeclineViewRequestResponse, IEvent, IEventDetails, IEventId, IGetAllEventsResponse, IGetManagedEventsResponse, ISendViewRequestResponse } from "@event-participation-trends/api/event/util";
import { firstValueFrom } from "rxjs";
import { Status } from '@event-participation-trends/api/user/util';

interface IGetRequestsUsersResponse {
  Requesters : IUser[];
}

interface IGetRequestsResponse {
  users: IGetRequestsUsersResponse[];
}

@Injectable({
  providedIn: "root"
})
export class AppApiService {
  constructor(private http: HttpClient) {}

  // USERS //
  async getAllUsers(): Promise<IUser[]>{
    return firstValueFrom(this.http.get<IGetUsersResponse>("/api/user/getAllUsers")).then((response) => {
      return response.users;
    });
  }

  async updateUserRole(user: IUpdateRoleRequest): Promise<Status>{
    return firstValueFrom(this.http.post<IupdateRoleResponse>("/api/user/updateUserRole", user)).then((response) => {
      return response.status;
    });
  }

  // EVENTS //
  async createEvent(event: IEventDetails): Promise<Status | null | undefined>{
    return firstValueFrom(this.http.post<ICreateEventResponse>("/api/event/createEvent", event)).then((response) => {
      return response.status;
    });
  }

  async getAllEvents(): Promise<IEvent[]>{
    return firstValueFrom(this.http.get<IGetAllEventsResponse>("/api/event/getAllEvents")).then((response) => {
      return response.events;
    });
  }

  async getManagedEvents(): Promise<IEvent[]>{
    return firstValueFrom(this.http.get<IGetManagedEventsResponse>("/api/event/getManagedEvents")).then((response) => {
      return response.events;
    });
  }

  async sendViewRequest(eventId: IEventId): Promise<Status | null | undefined>{
    return firstValueFrom(this.http.post<ISendViewRequestResponse>("/api/event/sendViewRequest", eventId)).then((response) => {
      return response.status;
    });
  }

  // REQUESTS //

  async getAccessRequests(eventId: IEventId): Promise<IUser[]> {
    const url = `/api/event/getAllViewRequests?eventId=${eventId.eventId}`;

    return firstValueFrom(this.http.get<IGetRequestsResponse>(url)).then((response) => {
      return response.users[0].Requesters;
    });
  }

  async acceptAccessRequest(request: IAcceptViewRequestRequest): Promise<Status | null | undefined>{
    return firstValueFrom(this.http.post<IAcceptViewRequestResponse>("/api/event/acceptViewRequest", request)).then((response) => {
      return response.status;
    });
  }

  async declineAccessRequest(request: IDeclineViewRequestRequest): Promise<Status | null | undefined>{
    return firstValueFrom(this.http.post<IDeclineViewRequestResponse>("/api/event/declineViewRequest", request)).then((response) => {
      return response.status;
    });
  }
}
