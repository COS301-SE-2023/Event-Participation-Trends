import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AllEventsPageComponent } from './all-events-page.component';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEventsPageComponent, HttpClientTestingModule], // Import HttpClientModule
      providers: [AppApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should create', () => {
    httpTestingController.expectOne(`/api/user/getRole`);

    expect(component).toBeTruthy();
  });

  // test if the "all_events" list gets populated with data
  it('should populate the "all_events" list with empty data', () => {
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
  });

  it('should have admin role', () => {
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'admin';

    expect(component.isAdmin()).toBeTruthy();
  });

  it('should have manager role', () => {
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'manager';

    expect(component.isManager()).toBeTruthy();
  });

  it('should have viewer role', () => {
    httpTestingController.expectOne(`/api/user/getRole`);

    component.role = 'viewer';

    expect(component.isViewer()).toBeTruthy();
  });

  // ==============================
  // ====== Integration Test ======
  // ==============================
  it('should populate the "all_events" list with data', fakeAsync(() => {
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

    component.loadEvents();

    // Expect a call to this URL
    const req = httpTestingController.expectOne(`/api/event/getAllEvents`);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick(300);

    // Run our tests
    expect(component.all_events).toBe(undefined);
  }));
});
