import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AllEventsPageComponent } from './all-events-page.component';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent, IGetAllEventsResponse, IGetManagedEventsResponse, IGetUserViewingEventsResponse } from '@event-participation-trends/api/event/util';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// export interface IEvent {
//   StartDate?: Date | undefined | null;
//   EndDate?: Date | undefined | null;
//   Name?: string | undefined | null;
//   Category?: string | undefined | null;
//   Location?: string | undefined | null;
//   FloorLayout?: IFloorLayout | undefined | null;
//   FloorLayoutImg?: Types.ObjectId[] | undefined | null;
//   Stalls?: IStall[] | undefined | null;
//   Sensors?: ISensor[] | undefined | null;
//   Devices?: IPosition[] | undefined | null;
//   Manager?: Types.ObjectId | undefined | null;
//   Requesters?: Types.ObjectId[] | undefined | null;
//   Viewers?: Types.ObjectId[] | undefined | null;
//   PublicEvent?: boolean | undefined | null;
// }

describe('AllEventsPageComponent', () => {
  let component: AllEventsPageComponent;
  let fixture: ComponentFixture<AllEventsPageComponent>;
  let appApiService: AppApiService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEventsPageComponent, HttpClientTestingModule, RouterTestingModule], // Import HttpClientModule
      providers: [AppApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);

    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test if the "all_events" list gets populated with data
  it('should populate the "all_events" list with empty data', () => {
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);

    // mock response from calling "getAllEvents" from the AppApiService
    const mockResponse: IEvent[] = [];

    // mock the "getAllEvents" function from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockResponse);

    // first set the role to "admin" so that there is only a call to the "getAllEvents" function
    component.role = 'admin';

    // call the "getAllEvents" function from the AppApiService
    component.loadEvents();

    expect(appApiService.getAllEvents).toHaveBeenCalled();

    // test the response from the "getAllEvents" function
    expect(component.all_events).toEqual(mockResponse);

    httpTestingController.verify();
  });

  it('should have admin role', () => {
    component.role = 'admin';

    expect(component.isAdmin()).toBeTruthy();
  });

  it('should have manager role', () => {
    component.role = 'manager';

    expect(component.isManager()).toBeTruthy();
  });

  it('should have viewer role', () => {
    component.role = 'viewer';

    expect(component.isViewer()).toBeTruthy();
  });

  it('should navigate to event details for admin', () => {
    component.role = 'admin';
    const event = { _id: 'event_id' };

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.getURL(event);

    expect(navigateSpy).toHaveBeenCalledWith(['/event/event_id/details']);
  });

  it('should navigate to event details for manager managing the event', () => {
    component.role = 'manager';
    const event = { _id: 'event_id' };
    jest.spyOn(component, 'managesEvent').mockReturnValue(true);

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.getURL(event);

    expect(navigateSpy).toHaveBeenCalledWith(['/event/event_id/details']);
  });

  it('should navigate to event dashboard for manager not managing the event', () => {
    component.role = 'manager';
    const event = { _id: 'event_id' };
    jest.spyOn(component, 'managesEvent').mockReturnValue(false);

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.getURL(event);

    expect(navigateSpy).toHaveBeenCalledWith(['/event/event_id/dashboard']);
  });

  // ==============================
  // ====== Integration Test ======
  // ==============================

  it('should populate the "all_events" list with data', () => {
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'admin';

    const response: any[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'testEvent',
        Category: 'testCategory',
        Location: 'testLocation',
        FloorLayout: undefined,
        FloorLayoutImg: undefined,
        Stalls: undefined,
        Sensors: undefined,
        Devices: undefined,
        Manager: undefined,
        Requesters: undefined,
        Viewers: undefined,
        PublicEvent: false,
      }
    ];

    httpClient.get<IGetAllEventsResponse>('/api/event/getAllEvents').subscribe((response) => {
      component.all_events = response.events;

      expect(component.all_events).toEqual(response.events);
    });

    const req = httpTestingController.expectOne(`/api/event/getAllEvents`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });

  it('should populate managed events array', () => {
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'manager';

    const response: any[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'testEvent',
        Category: 'testCategory',
        Location: 'testLocation',
        FloorLayout: undefined,
        FloorLayoutImg: undefined,
        Stalls: undefined,
        Sensors: undefined,
        Devices: undefined,
        Manager: undefined,
        Requesters: undefined,
        Viewers: undefined,
        PublicEvent: false,
      }
    ];

    httpClient.get<IGetManagedEventsResponse>('/api/event/getManagedEvents').subscribe((response) => {
      component.my_events = response.events;

      expect(component.my_events).toEqual(response.events);
    });

    const req = httpTestingController.expectOne(`/api/event/getManagedEvents`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });

  it('should populate subscribed events array', () => {
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'viewer';

    const response: any[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'testEvent',
        Category: 'testCategory',
        Location: 'testLocation',
        FloorLayout: undefined,
        FloorLayoutImg: undefined,
        Stalls: undefined,
        Sensors: undefined,
        Devices: undefined,
        Manager: undefined,
        Requesters: undefined,
        Viewers: undefined,
        PublicEvent: false,
      }
    ];

    httpClient.get<IGetUserViewingEventsResponse>('/api/event/getSubscribedEvents').subscribe((response) => {
      component.subscribed_events = response.events;

      expect(component.subscribed_events).toEqual(response.events);
    });

    const req = httpTestingController.expectOne(`/api/event/getSubscribedEvents`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });

});
