import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AllEventsPageComponent } from './all-events-page.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEventsPageComponent, HttpClientModule], // Import HttpClientModule
      providers: [AppApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test if the "all_events" list gets populated with data
  it('should populate the "all_events" list with empty data', () => {
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

  // test if the "my_events" list gets populated with data
  // it('should populate the "my_events" list with empty data', fakeAsync(() => {
  //   // mock response from calling "getManagedEvents" from the AppApiService
  //   const mockResponse: IEvent[] = [];

  //   // mock the "getManagedEvents" function from the AppApiService
  //   jest.spyOn(appApiService, 'getManagedEvents').mockResolvedValue(mockResponse);

  //   // first set the role to "manager" so that there is only a call to the "getManagedEvents" function
  //   component.role = 'manager';

  //   // call the "getManagedEvents" function from the AppApiService
  //   component.loadEvents();
  //   expect(appApiService.getManagedEvents).toHaveBeenCalled();

  //   // test the response from the "getManagedEvents" function
  //   expect(component.my_events).toEqual(mockResponse);
  // }));

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
});
