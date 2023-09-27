import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateEventModalComponent } from './create-event-modal.component';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ICreateEventResponse, IEvent } from '@event-participation-trends/api/event/util';
import { Status } from '@event-participation-trends/api/user/util';

describe('CreateEventModalComponent', () => {
  let component: CreateEventModalComponent;
  let fixture: ComponentFixture<CreateEventModalComponent>;
  let appApiService: AppApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventModalComponent, HttpClientTestingModule],
      providers: [
        AppApiService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventModalComponent);
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
    expect(component).toBeTruthy();
  });

  it('should create an event', fakeAsync (() => {
    const mockEventName = 'testEvent';
    const response: ICreateEventResponse = {
      status: Status.SUCCESS
    };
    const eventResponse: IEvent = {
      StartDate: undefined,
      EndDate: undefined,
      Name: mockEventName, // we only have this data for the event after it was created
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

    // Perform a request (this is fakeAsync to the responce won't be called until tick() is called)
    appApiService.createEvent({Name: mockEventName});

    // Expect a call to this URL
    const req = httpTestingController.expectOne(`/api/event/createEvent`);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual("POST");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    // Run our tests
    expect(response.status).toEqual(Status.SUCCESS);

    // Make a call to get event by name
    appApiService.getEventByName(mockEventName);

    // Expect a call to this URL
    const req2 = httpTestingController.expectOne(`/api/event/getEvent?eventName=${mockEventName}`);

    // Assert that the request is a GET.
    expect(req2.request.method).toEqual("GET");
    // Respond with this data when called
    req2.flush(eventResponse);

    // Call tick whic actually processes te response
    tick();

    // Run our tests
    expect(eventResponse.Name).toEqual(mockEventName);
  }));
});
