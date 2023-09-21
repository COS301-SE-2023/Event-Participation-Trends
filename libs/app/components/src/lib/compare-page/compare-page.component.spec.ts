import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparePageComponent } from './compare-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';

import { matCheckCircleOutline } from "@ng-icons/material-icons/outline";
import { matRadioButtonUnchecked, matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroAdjustmentsHorizontal } from "@ng-icons/heroicons/outline";
import { heroInboxSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IEvent, IGetAllEventsResponse, IGetEventStatisticsResponse } from '@event-participation-trends/api/event/util';

class Stats {
  id = 0
  total_attendance = 0
  average_attendance = 0
  peak_attendance = 0
  turnover_rate = 0
  average_attendance_time = 0
  max_attendance_time = 0
}

describe('ComparePageComponent', () => {
  let component: ComparePageComponent;
  let fixture: ComponentFixture<ComparePageComponent>;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparePageComponent, NgIconsModule, HttpClientModule, RouterTestingModule],
      providers: [
        AppApiService,
        provideIcons({matCheckCircleOutline, matRadioButtonUnchecked, heroAdjustmentsHorizontal, matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, heroInboxSolid}),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // =========================================
  // =========== UNIT TESTS ==================
  // =========================================

  it('should select an event when clicking on the event', () => {
    // create mock events
    const mockEvents: IEvent[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 1',
        Category: 'Test Category 1',
        Location: 'Test Location 1',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 2',
        Category: 'Test Category 2',
        Location: 'Test Location 2',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 3',
        Category: 'Test Category 3',
        Location: 'Test Location 3',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      }
    ];
    // mock response
    const mockStats: IGetEventStatisticsResponse = {
      total_attendance: 1,
      average_attendance: 1,
      peak_attendance: 1,
      turnover_rate: 1,
      average_attendance_time: 1,
      max_attendance_time: 1,
      attendance_over_time_data: null,
    };

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);
    // mock the call to getEventStatistics from the AppApiService
    jest.spyOn(appApiService, 'getEventStatistics').mockResolvedValue(mockStats);

    component.events = mockEvents;
    for (const event of component.events) {
      component.eventList.push({event, selected: false});
    }

    // call selectEvent(event) with the first event
    component.selectEvent(component.eventList[0].event);

    // check if the event was selected
    expect(component.eventList[0].selected).toBe(true);
  });

  it('should not select an event when clicking on the event and 2 events are already selected', () => {
    // create mock events
    const mockEvents: IEvent[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 1',
        Category: 'Test Category 1',
        Location: 'Test Location 1',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 2',
        Category: 'Test Category 2',
        Location: 'Test Location 2',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 3',
        Category: 'Test Category 3',
        Location: 'Test Location 3',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      }
    ];
    // mock response
    const mockStats: IGetEventStatisticsResponse = {
      total_attendance: 1,
      average_attendance: 1,
      peak_attendance: 1,
      turnover_rate: 1,
      average_attendance_time: 1,
      max_attendance_time: 1,
      attendance_over_time_data: null,
    };

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);
    // mock the call to getEventStatistics from the AppApiService
    jest.spyOn(appApiService, 'getEventStatistics').mockResolvedValue(mockStats);
    component.events = mockEvents;
    for (const event of component.events) {
      component.eventList.push({event, selected: false});
    }

    // select 2 events
    component.selectEvent(component.eventList[0].event);
    component.selectEvent(component.eventList[1].event);

    // selectedEvents must equal 2 now
    expect(component.eventsSelected).toBe(2);

    // call selectEvent(event) with the first event
    component.selectEvent(component.eventList[2].event);

    // check if the event was selected
    expect(component.eventList[2].selected).toBe(false);
  });

  it('should deselect an event when clicking on the event again', () => {
    // create mock events
    const mockEvents: IEvent[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 1',
        Category: 'Test Category 1',
        Location: 'Test Location 1',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 2',
        Category: 'Test Category 2',
        Location: 'Test Location 2',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 3',
        Category: 'Test Category 3',
        Location: 'Test Location 3',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      }
    ];
    // mock response
    const mockStats: IGetEventStatisticsResponse = {
      total_attendance: 1,
      average_attendance: 1,
      peak_attendance: 1,
      turnover_rate: 1,
      average_attendance_time: 1,
      max_attendance_time: 1,
      attendance_over_time_data: null,
    };

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);
    // mock the call to getEventStatistics from the AppApiService
    jest.spyOn(appApiService, 'getEventStatistics').mockResolvedValue(mockStats);

    component.events = mockEvents;
    for (const event of component.events) {
      component.eventList.push({event, selected: false});
    }

    // call selectEvent(event) with the first event
    component.selectEvent(component.eventList[0].event);

    // check if the event was selected
    expect(component.eventList[0].selected).toBe(true);

    // call selectEvent(event) with the first event again
    component.selectEvent(component.eventList[0].event);

    // check if the event was deselected
    expect(component.eventList[0].selected).toBe(false);
  });

  it('should select a category and filter the event list', () => {
    const mockEvents: IEvent[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 1',
        Category: 'Test Category 1',
        Location: 'Test Location 1',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 2',
        Category: 'Test Category 1',
        Location: 'Test Location 10',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 3',
        Category: 'Test Category 2',
        Location: 'Test Location 111',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 15',
        Category: 'Test Category 3',
        Location: 'Test Location 110',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
    ];
    //mock the call to get events
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);
    // mock the call to get categories
    jest.spyOn(appApiService, 'getManagedEventCategories').mockResolvedValue(['Test Category 1', 'Test Category 2', 'Test Category 3']);

    // set events to the mock events
    component.events = mockEvents;
    // set categories to the mock categories
    component.categories = ['Test Category 1', 'Test Category 2', 'Test Category 3'];

    // set the selected category to "Test Category 1"
    component.selectedCategory = 'Test Category 1';

    expect(component.selectedCategory).toBe('Test Category 1');

    // test if getEvents() returns the filtered events
    expect(component.getEvents()).toEqual([mockEvents[0], mockEvents[1]]);
  });

  it('should select the "Show All" category and show all events', () => {
    const mockEvents: IEvent[] = [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 1',
        Category: 'Test Category 1',
        Location: 'Test Location 1',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 2',
        Category: 'Test Category 1',
        Location: 'Test Location 10',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 3',
        Category: 'Test Category 2',
        Location: 'Test Location 111',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: 'Test Event 15',
        Category: 'Test Category 3',
        Location: 'Test Location 110',
        FloorLayout: null,
        FloorLayoutImg: null,
        Stalls: null,
        Sensors: null,
        Devices: null,
        Manager: null,
        Requesters: null,
        Viewers: null,
        PublicEvent: false,
      },
    ];
    //mock the call to get events
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);
    // mock the call to get categories
    jest.spyOn(appApiService, 'getManagedEventCategories').mockResolvedValue(['Test Category 1', 'Test Category 2', 'Test Category 3']);

    // set events to the mock events
    component.events = mockEvents;
    // set categories to the mock categories
    component.categories = ['Test Category 1', 'Test Category 2', 'Test Category 3'];

    // set the selected category to "Test Category 1"
    component.selectedCategory = 'Test Category 1';

    expect(component.selectedCategory).toBe('Test Category 1');

    // test if getEvents() returns the filtered events
    expect(component.getEvents()).toEqual([mockEvents[0], mockEvents[1]]);

    // set the selected category to "Show All"
    component.selectedCategory = 'Show All';

    expect(component.selectedCategory).toBe('Show All');

    // test if getEvents() returns all events
    expect(component.getEvents()).toEqual(mockEvents);
  });

  // =========================================
  // =========== INTEGRATION TESTS ===========
  // =========================================
  it('should call getEvents() and getManagedCategories() and both must have the same categories', async () => {
    let endpoint = 'api/event/getAllEvents';

    const categories: string[] = [];
    const httpClient: HttpClient = TestBed.inject(HttpClient);
    httpClient.get<IGetAllEventsResponse>(endpoint).subscribe((response) => {
      component.events = response.events;
      
      for (const event of component.events) {
        if (event.Category && !categories.includes(event.Category)) {
          categories.push(event.Category);
        }
      }

      // sort the categories
      categories.sort((a, b) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      });

      return categories;
    });

    // make a call to get the categories
    endpoint = 'api/event/getManagedEventCategories';
    httpClient.get<string[]>(endpoint).subscribe((response) => {
      component.categories = response;

      // sort the categories
      component.categories.sort((a, b) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      });

      return component.categories;
    });

    // test if the categories are correct
    expect(component.categories).toEqual(categories);
  });
});
