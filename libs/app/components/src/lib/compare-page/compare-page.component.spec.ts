import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparePageComponent } from './compare-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';

import { matCheckCircleOutline } from "@ng-icons/material-icons/outline";
import { matRadioButtonUnchecked, matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroAdjustmentsHorizontal } from "@ng-icons/heroicons/outline";
import { heroInboxSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IEvent } from '@event-participation-trends/api/event/util';

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

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);

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

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);

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

    // mock the call to getAllEvents from the AppApiService
    jest.spyOn(appApiService, 'getAllEvents').mockResolvedValue(mockEvents);

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
});
