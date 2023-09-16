import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatmapContainerComponent } from './heatmap-container.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppApiService } from '@event-participation-trends/app/api';

import { matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, matRedo, matPlayCircleOutline, matPauseCircleOutline } from "@ng-icons/material-icons/baseline";
import { matWarningAmberRound, matErrorOutlineRound } from "@ng-icons/material-icons/round";
import { IGetAllEventsResponse, IGetEventDevicePositionResponse } from '@event-participation-trends/api/event/util';

describe('HeatmapContainerComponent', () => {
  let component: HeatmapContainerComponent;
  let fixture: ComponentFixture<HeatmapContainerComponent>;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapContainerComponent, NgIconsModule, HttpClientModule, RouterTestingModule],
      providers: [
        AppApiService,
        provideIcons({matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, matWarningAmberRound, matErrorOutlineRound, matRedo, matPlayCircleOutline, matPauseCircleOutline}),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop the flow of the heatmap', () => {
    component.pauseFlowOfHeatmap();

    expect(component.paused).toBe(true);
  });

  it('should pause the flow of the heatmap', () => {
    component.pauseFlowOfHeatmap();

    expect(component.changingTimeRange).toBe(true);
  });

  it('should append highlight points to the timeline container', async () => {
    let positions = [];
    let endpoint = 'api/event/getAllEvents';
    // make an api call to get events
    const httpClient: HttpClient = TestBed.inject(HttpClient);
    httpClient.get<IGetAllEventsResponse>(endpoint).subscribe((res) => {
      // get the events from the response
      const events = res.events;
      // get the first event
      const event = events[0];
      // get the event id
      const eventId = (event as any)._id;
      // get the event dates
      const startDate = event.StartDate;
      const endDate = event.EndDate;

      // copy startTime up to 'GMT+0000'
      const startTimeString = startDate?.toString().slice(0, 33);
      // copy endTime up to 'GMT+0000'
      const endTimeString = endDate?.toString().slice(0, 33);

      endpoint = `/api/event/getEventDevicePosition?eventId=${eventId}&startTime=${startTimeString}&endTime=${endTimeString}`;
      // make an api call to get the device positions
      httpClient.get<IGetEventDevicePositionResponse>(endpoint).subscribe((res) => {
        positions = res.positions ? res.positions : [];

        if (positions.length > 0) {
          // get first position timestamp and convert it to a Date object
          const timestamp = positions[0].timestamp ? new Date(positions[0].timestamp) : null;

          if (timestamp) {
            component.setHeatmapIntervalData(timestamp);

            expect(component.heatmap?.getData.length).toBeGreaterThan(0);
          }
        }
      });
    });
  });
});
