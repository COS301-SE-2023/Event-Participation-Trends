import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { EventDetailsPageComponent } from './event-details-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppApiService } from '@event-participation-trends/app/api';
import { Router } from '@angular/router';

import { heroInboxSolid } from "@ng-icons/heroicons/solid";
import { matDeleteRound } from "@ng-icons/material-icons/round";
import { matCheckBox, matCancelPresentation } from "@ng-icons/material-icons/baseline";
import { IAcceptViewRequestResponse, IDeclineViewRequestResponse, IUpdateEventDetailsRequest, IUpdateEventDetailsResponse } from '@event-participation-trends/api/event/util';
import { Status } from '@event-participation-trends/api/user/util';

describe('EventDetailsPageComponent', () => {
  let component: EventDetailsPageComponent;
  let fixture: ComponentFixture<EventDetailsPageComponent>;
  let appApiService: AppApiService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsPageComponent, NgIconsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppApiService,
        provideIcons({ heroInboxSolid, matDeleteRound, matCheckBox, matCancelPresentation })
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    router = TestBed.inject(Router);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home if ID is null', () => {
    jest.spyOn(router, 'navigate');
    component.id = '';
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should discard changes', () => {
    component.old_category = "test";
    component.old_location = "test location";
    component.old_isPublic = true;
    component.old_start_time = "2021-05-05T00:00";
    component.old_end_time = "2021-05-05T00:00";

    component.discardChanges();

    expect(component.category).toBe("test");
    expect(component.location).toBe("test location");
    expect(component.isPublic).toBe(true);
    expect(component.start_time).toBe("2021-05-05T00:00");
    expect(component.end_time).toBe("2021-05-05T00:00");
  });

  it('should detect changes', () => {
    component.old_category = "test";
    component.old_location = "test location";
    component.old_isPublic = true;
    component.old_start_time = "2021-05-05T00:00";
    component.old_end_time = "2021-05-05T00:00";

    component.category = "test2";
    component.location = "test location2";
    component.isPublic = false;
    component.start_time = "2021-05-05T00:01";
    component.end_time = "2021-05-05T00:01";

    expect(component.hasChanges()).toBe(true);
  });

  it('should save changes', fakeAsync (() => {
    httpTestingController.expectOne(`/api/event/getEvent?eventId=`);

    const response: IUpdateEventDetailsResponse = {
      status: Status.SUCCESS
    };

    // assign mock values
    component.event = {
      _id: undefined,
      StartDate: undefined,
      EndDate: undefined,
      Name: undefined,
      Category: undefined,
      Location: undefined,
      FloorLayout: undefined,
      FloorLayoutImg: undefined,
      Stalls: undefined,
      Sensors: undefined,
      Devices: undefined,
      Manager: undefined,
      Requesters: undefined,
      Viewers: undefined,
      PublicEvent: undefined
    };

    component.start_time = "2021-05-05T00:00";
    component.end_time = "2021-05-05T00:00";
    component.category = "test";
    component.location = "test location";
    component.isPublic = true;
    component.event.name = "test event";
    component.event._id = "test id";

    const db_start = new Date(new Date(component.start_time).getTime());
    const db_end = new Date(new Date(component.end_time).getTime());

    const updateDetails: IUpdateEventDetailsRequest = {
      eventId: component.event._id,
      eventDetails: {
        Name: component.event.name,
        Category: component.category,
        Location: component.location,
        PublicEvent: component.isPublic,
        StartDate: db_start,
        EndDate: db_end,
      },
    };

    // Perform a request (this is fakeAsync to the responce won't be called until tick() is called)
    component.saveEvent();
    
    // Expect a call to this URL
    const req = httpTestingController.expectOne(`/api/event/updateEventDetails`);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual("POST");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    // Run our tests
    expect(response.status).toEqual(Status.SUCCESS);
    expect(component.old_category).toBe("test");
    expect(component.old_location).toBe("test location");
    expect(component.old_isPublic).toBe(true);
    expect(component.old_start_time).toBe("2021-05-05T00:00");
    expect(component.old_end_time).toBe("2021-05-05T00:00");

    // finish test
    httpTestingController.verify();

    flush();
  }));

  it('should remove request', () => {
    component.requests = [
      {
        _id: "1",
      },
      {
        _id: "2",
      },
      {
        _id: "3",
      }
    ];

    component.removeRequest(component.requests[1]);

    // check if the request was removed
    const request = component.requests.find(request => request._id === "2");

    expect(component.requests.length).toBe(2);
    expect(request).toBe(undefined);
  });

  it('should accept request', fakeAsync (() => {
    httpTestingController.expectOne(`/api/event/getEvent?eventId=`);

    component.event = {
      _id: "test id",
    };

    component.requests = [
      {
        _id: "1",
      },
      {
        _id: "2",
      },
      {
        _id: "3",
      }
    ];

    const mockRequest = {
      userEmail: "test@email.com",
      eventId: "2",
    };

    const response: IAcceptViewRequestResponse = {
      status: Status.SUCCESS
    };

    // Perform a request (this is fakeAsync to the responce won't be called until tick() is called)
    component.acceptRequest(mockRequest);
    component.removeRequest(component.requests[1]);

    // Expect a call to this URL
    const req = httpTestingController.expectOne(`/api/event/acceptViewRequest`);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual("POST");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    // check if the request was removed
    const request = component.requests.find(request => request._id === "2");

    // Run our tests
    expect(response.status).toEqual(Status.SUCCESS);
    expect(component.requests.length).toBe(2);
    expect(request).toBe(undefined);

    // finish test
    httpTestingController.verify();

    flush();
  }));   
  
  it('should decline request', fakeAsync (() => {
    httpTestingController.expectOne(`/api/event/getEvent?eventId=`);
    
    component.event = {
      _id: "test id",
    };

    component.requests = [
      {
        _id: "1",
      },
      {
        _id: "2",
      },
      {
        _id: "3",
      }
    ];

    const mockRequest = {
      userEmail: "test@email.com",
      eventId: "2",
    };

    const response: IDeclineViewRequestResponse = {
      status: Status.SUCCESS
    };

    // Perform a request (this is fakeAsync to the responce won't be called until tick() is called)
    component.declineRequest(mockRequest);
    component.removeRequest(component.requests[1]);

    // Expect a call to this URL
    const req = httpTestingController.expectOne(`/api/event/declineViewRequest`);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual("POST");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    // check if the request was removed
    const request = component.requests.find(request => request._id === "2");

    // Run our tests
    expect(response.status).toEqual(Status.SUCCESS);
    expect(component.requests.length).toBe(2);
    expect(request).toBe(undefined);

    // finish test
    httpTestingController.verify();

    flush();
  }));   

  it('should have empty requests', () => {
    component.requests = [];

    expect(component.emptyRequests()).toBe(true);
  });
});
