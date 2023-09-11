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
} from '@event-participation-trends/api/user/util';
import {
  IAcceptViewRequestRequest,
  IAcceptViewRequestResponse,
  ICreateEventResponse,
  IDeclineViewRequestRequest,
  IDeclineViewRequestResponse,
  IDeleteEventResponse,
  IEvent,
  IEventDetails,
  IEventId,
  IGetAllEventCategoriesResponse,
  IGetAllEventsResponse,
  IGetEventDevicePositionResponse,
  IGetEventFloorlayoutImageResponse,
  IGetEventFloorlayoutResponse,
  IGetEventResponse,
  IGetFloorplanBoundariesResponse,
  IGetManagedEventCategoriesResponse,
  IGetManagedEventsResponse,
  IGetUserViewingEventsResponse,
  IImage,
  IImageUploadRequest,
  IImageUploadResponse,
  IPosition,
  ISendViewRequestResponse,
  IUpdateEventDetailsRequest,
  IUpdateEventDetailsResponse,
  IUpdateFloorlayoutResponse,
} from '@event-participation-trends/api/event/util';
import { firstValueFrom } from 'rxjs';
import { Status } from '@event-participation-trends/api/user/util';
import { CookieService } from 'ngx-cookie-service';
import {
  IgetNewEventSensorIdResponse,
  IisLinkedResponse,
  IlinkSensorRequest,
} from '@event-participation-trends/api/sensorlinking';

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
    const response = await firstValueFrom(
      this.http.get<IGetUsersResponse>('/api/user/getAllUsers', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.users;
  }

  async updateUserRole(user: IUpdateRoleRequest): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IupdateRoleResponse>('/api/user/updateUserRole', user, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.status;
  }

  async getRole(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IGetUserRoleResponse>('/api/user/getRole', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.userRole || '';
  }

  async getUserName(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http
          .get<IGetUserNameResponse>('/api/user/getUserName', {
            headers: {
              'x-csrf-token': this.cookieService.get('csrf'),
            },
          })
          .pipe()
      );
      return response.username || '';
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async getFullName(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IGetFullNameResponse>('/api/user/getFullName', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.fullName || '';
  }

  async getEmail(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IGetEmailResponse>('/api/user/getEmail', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.email || '';
  }

  // EVENTS //
  async createEvent(event: IEventDetails): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<ICreateEventResponse>('/api/event/createEvent', event, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.status || Status.FAILURE;
  }

  async getEventByName(eventName: string): Promise<IEvent> {
    const response = await firstValueFrom(
      this.http.get<IGetEventResponse>(
        `/api/event/getEvent?eventName=${eventName}`,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.event;
  }

  async getEvent(eventId: IEventId): Promise<IEvent> {
    return firstValueFrom(
      this.http.get<IEvent>(`/api/event/getEvent?eventId=${eventId.eventId}`, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
  }

  async getAllEvents(): Promise<IEvent[]> {
    const response = await firstValueFrom(
      this.http.get<IGetAllEventsResponse>('/api/event/getAllEvents', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.events;
  }

  async getSubscribedEvents(): Promise<IEvent[]> {
    const response = await firstValueFrom(
      this.http.get<IGetUserViewingEventsResponse>(
        '/api/event/getAllViewingEvents',
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.events;
  }

  async getManagedEvents(): Promise<IEvent[]> {
    const response = await firstValueFrom(
      this.http.get<IGetManagedEventsResponse>('/api/event/getManagedEvents', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.events;
  }

  async updateEventDetails(
    details: IUpdateEventDetailsRequest
  ): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IUpdateEventDetailsResponse>(
        '/api/event/updateEventDetails',
        details,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async getEventFloorLayout(eventId: string): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IGetEventFloorlayoutResponse>(
        `/api/event/getEventFloorLayout?eventId=${eventId}`,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.floorlayout || '';
  }

  async deleteEvent(eventId: IEventId): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IDeleteEventResponse>(
        '/api/event/deleteEvent',
        eventId,
        { 
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async sendViewRequest(eventId: IEventId): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<ISendViewRequestResponse>(
        '/api/event/sendViewRequest',
        eventId,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  // REQUESTS //

  async getAccessRequests(eventId: IEventId): Promise<IUser[]> {
    const url = `/api/event/getAllViewRequests?eventId=${eventId.eventId}`;

    const response = await firstValueFrom(
      this.http.get<IGetRequestsResponse>(url, {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.users[0]?.Requesters || [];
  }

  async acceptAccessRequest(
    request: IAcceptViewRequestRequest
  ): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IAcceptViewRequestResponse>(
        '/api/event/acceptViewRequest',
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async declineAccessRequest(
    request: IDeclineViewRequestRequest
  ): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IDeclineViewRequestResponse>(
        '/api/event/declineViewRequest',
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async getProfilePicUrl(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IGetProfilePicUrlResponse>('/api/user/getProfilePicUrl', {
        headers: {
          'x-csrf-token': this.cookieService.get('csrf'),
        },
      })
    );
    return response.url;
  }

  async updateFloorLayout(
    eventId: string,
    floorLayout: string
  ): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IUpdateFloorlayoutResponse>(
        '/api/event/updateEventFloorLayout',
        {
          eventId: eventId,
          floorlayout: floorLayout,
        },
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async addNewFloorplanImages(
    eventId: string,
    base64: string,
    object: string,
    scale: number,
    type: string
  ): Promise<Status> {
    const response = await firstValueFrom(
      this.http.post<IImageUploadResponse>(
        '/api/event/uploadFloorlayoutImage',
        {
          eventId: eventId,
          imgBase64: base64,
          imageObj: object,
          imageScale: scale,
          imageType: type
        },
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.status || Status.FAILURE;
  }

  async getFloorLayoutImages(
    eventId: string
  ): Promise<IImage[]> {
    const response = await firstValueFrom(
      this.http.get<IGetEventFloorlayoutImageResponse>(
        `/api/event/getFloorLayoutImage?eventId=${eventId}`,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.images || [];
  }

  async getNewEventSensorId(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<IgetNewEventSensorIdResponse>(
        '/api/sensorLinking/getNewID',
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.id;
  }

  async linkSensor(
    request: IlinkSensorRequest,
    eventSensorMac: string
  ): Promise<{ success: boolean }> {
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(
        `/api/sensorlinking/${eventSensorMac}`,
        request,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response;
  }

  async isLinked(eventId: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.get<IisLinkedResponse>(
        `/api/sensorLinking/isLinked/${eventId}`,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.isLinked;
  }

  async getAllEventCategories(): Promise<string[]> {
    const response = await firstValueFrom(
      this.http.get<IGetAllEventCategoriesResponse>(
        '/api/event/getAllEventCategories',
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.categories || [];
  }

  async getManagedEventCategories(): Promise<string[]> {
    const response = await firstValueFrom(
      this.http.get<IGetManagedEventCategoriesResponse>(
        '/api/event/getManagedEventCategories',
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.categories || [];
  }

  async getEventDevicePosition(
    eventId: string | null,
    startTime: Date | null | undefined,
    endTime: Date | null | undefined
  ): Promise<IPosition[]> {
    // copy startTime up to 'GMT+0000'
    const startTimeString = startTime?.toString().slice(0, 33);
    // copy endTime up to 'GMT+0000'
    const endTimeString = endTime?.toString().slice(0, 33);
    const response = await firstValueFrom(
      this.http.get<IGetEventDevicePositionResponse>(
        `/api/event/getEventDevicePosition?eventId=${eventId}&startTime=${startTimeString}&endTime=${endTimeString}`,
        {
          headers: {
            'x-csrf-token': this.cookieService.get('csrf'),
          },
        }
      )
    );
    return response.positions || [];
  }

  async getFloorplanBoundaries(eventId: string) : Promise<IGetFloorplanBoundariesResponse> {
    return firstValueFrom(
      this.http.get<IGetFloorplanBoundariesResponse>(
        `/api/event/getFloorplanBoundaries?eventId=${eventId}`,
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
}
