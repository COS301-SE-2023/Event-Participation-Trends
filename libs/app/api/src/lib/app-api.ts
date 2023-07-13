import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IGetEmailResponse,
  IGetFullNameResponse,
  IGetProfilePicUrlResponse,
  IGetUserNameResponse,
  IGetUserRoleResponse,
  IGetUsersResponse,
  IUpdateRoleRequest,
  IUser,
  IupdateRoleResponse,
  Role,
} from '@event-participation-trends/api/user/util';
import {
  IAcceptViewRequestRequest,
  IAcceptViewRequestResponse,
  ICreateEventResponse,
  IDeclineViewRequestRequest,
  IDeclineViewRequestResponse,
  IEvent,
  IEventDetails,
  IEventId,
  IGetAllEventCategoriesResponse,
  IGetAllEventsResponse,
  IGetManagedEventsResponse,
  IGetUserViewingEventsResponse,
  ISendViewRequestResponse,
  IUpdateEventDetailsRequest,
  IUpdateEventDetailsResponse,
  IUpdateFloorlayoutResponse
} from '@event-participation-trends/api/event/util';
import { Observable, firstValueFrom } from 'rxjs';
import { Status } from '@event-participation-trends/api/user/util';
import { CookieService } from 'ngx-cookie-service';
import { IgetNewEventSensorIdResponse, IisLinkedResponse, IlinkSensorRequest } from '@event-participation-trends/api/sensorlinking';

interface IGetRequestsUsersResponse {
  Requesters: IUser[];
}

interface IGetRequestsResponse {
  users: IGetRequestsUsersResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class AppApiService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // USERS //
  async getAllUsers(): Promise<IUser[]> {
    return firstValueFrom(
      this.http.get<IGetUsersResponse>('/api/user/getAllUsers', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    ).then((response) => {
      return response.users;
    });
  }

  async updateUserRole(user: IUpdateRoleRequest): Promise<Status> {
    return firstValueFrom(
      this.http.post<IupdateRoleResponse>('/api/user/updateUserRole', user, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    ).then((response) => {
      return response.status;
    });
  }

  getRole(): Observable<IGetUserRoleResponse> {
    return this.http.get<IGetUserRoleResponse>('/api/user/getRole', {
      headers: {
        'x-csrf-token': this.cookieService.get('csrf'),
      },
    });
  }

  getUserName(): Observable<IGetUserNameResponse> {
    return this.http.get<IGetUserNameResponse>('/api/user/getUserName', {
      headers: {
        'x-csrf-token': this.cookieService.get('csrf'),
      },
    });
  }

  getFullName(): Observable<IGetFullNameResponse> {
      return this.http.get<IGetFullNameResponse>('/api/user/getFullName', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      });
    }

  getEmail(): Observable<IGetEmailResponse> {
    return this.http.get<IGetEmailResponse>('/api/user/getEmail', {
      headers: {
        'x-csrf-token': this.cookieService.get('csrf'),
      },
    });
  }

  // EVENTS //
  createEvent(event: IEventDetails): Observable<ICreateEventResponse> {
    return this.http.post<ICreateEventResponse>(
      '/api/event/createEvent',
      event,
      {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      }
    );
  }

  getAllEvents(): Observable<IGetAllEventsResponse> {
    return this.http.get<IGetAllEventsResponse>('/api/event/getAllEvents', {
      headers: {
        'x-csrf-token': this.cookieService.get('csrf'),
      },
    });
  }

  getSubscribedEvents(): Observable<IGetUserViewingEventsResponse> {
    return this.http.get<IGetUserViewingEventsResponse>(
      '/api/event/getAllViewingEvents',
      {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      }
    );
  }

  getManagedEvents(): Observable<IGetManagedEventsResponse> {
    return this.http.get<IGetManagedEventsResponse>(
      '/api/event/getManagedEvents',
      {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      }
    );
  }

  async updateEventDetails(
    details: IUpdateEventDetailsRequest
  ): Promise<IUpdateEventDetailsResponse> {
    return firstValueFrom(
      this.http.post<IUpdateEventDetailsResponse>(
        '/api/event/updateEventDetails',
        details,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    ).then((response) => {
      return response;
    });
  }

  sendViewRequest(eventId: IEventId): Observable<ISendViewRequestResponse> {
    return this.http.post<ISendViewRequestResponse>(
      '/api/event/sendViewRequest',
      eventId,
      {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      }
    );
  }

  // REQUESTS //

  async getAccessRequests(eventId: IEventId): Promise<IUser[]> {
    const url = `/api/event/getAllViewRequests?eventId=${eventId.eventId}`;

    return firstValueFrom(
      this.http.get<IGetRequestsResponse>(url, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    ).then((response) => {
      return response.users[0].Requesters;
    });
  }

  async acceptAccessRequest(
    request: IAcceptViewRequestRequest
  ): Promise<Status | null | undefined> {
    return firstValueFrom(
      this.http.post<IAcceptViewRequestResponse>(
        '/api/event/acceptViewRequest',
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    ).then((response) => {
      return response.status;
    });
  }

  async declineAccessRequest(
    request: IDeclineViewRequestRequest
  ): Promise<Status | null | undefined> {
    return firstValueFrom(
      this.http.post<IDeclineViewRequestResponse>(
        '/api/event/declineViewRequest',
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    ).then((response) => {
      return response.status;
    });
  }

  getProfilePicUrl(): Observable<IGetProfilePicUrlResponse>{
    return this.http.get<IGetProfilePicUrlResponse>('/api/user/getProfilePicUrl', {
      headers:{
        'x-csrf-token': this.cookieService.get('csrf'),
      }
    });
  }
  
  updateFloorLayout(eventId: string, floorLayout: string): Observable<IUpdateFloorlayoutResponse> {
    return this.http.post<IUpdateFloorlayoutResponse>('/api/event/updateEventFloorLayout', {
      eventId: eventId,
      floorlayout: floorLayout
    }, {
      headers:{
        'x-csrf-token': this.cookieService.get('csrf'),
      }
    });
  }

  getNewEventSensorId(): Observable<IgetNewEventSensorIdResponse> {
    return this.http.get<IgetNewEventSensorIdResponse>('/api/sensorLinking/getNewID', {
      headers:{
        'x-csrf-token': this.cookieService.get('csrf'),
      }
    });
  }

  async linkSensor(request: IlinkSensorRequest ,eventSensorMac: string): Promise<{success: true} | null | undefined> {
    return firstValueFrom(
      this.http.post<{success: true}>(
        `/api/sensorlinking/${eventSensorMac}`,
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    ).then((response) => {
      return response;
    });
  }

  isLinked(eventId: string): Observable<IisLinkedResponse> {
    return this.http.get<IisLinkedResponse>(`/api/sensorLinking/isLinked/${eventId}`, {
      headers:{
        'x-csrf-token': this.cookieService.get('csrf'),
      }
    });
  }
  
  async getAllEventCategories(): Promise<string[] | undefined | null> {
    return firstValueFrom(
      this.http.get<IGetAllEventCategoriesResponse>(
        '/api/event/getAllEventCategories',
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    ).then((response) => {
      return response.categories;
    });
  }
}
