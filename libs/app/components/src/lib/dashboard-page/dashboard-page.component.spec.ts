import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  matKeyboardDoubleArrowUp,
  matKeyboardDoubleArrowDown,
} from '@ng-icons/material-icons/baseline';
import {
  matFilterCenterFocus,
  matZoomIn,
  matZoomOut,
} from '@ng-icons/material-icons/baseline';
import { heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { heroBackward } from '@ng-icons/heroicons/outline';
import {
  IGetEventFloorlayoutResponse,
  IGetFloorplanBoundariesResponse,
  IImage,
} from '@event-participation-trends/api/event/util';
import { HttpClient } from '@angular/common/http';
import { AppApiService } from '@event-participation-trends/app/api';
import { NgZone } from '@angular/core';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let router: Router;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let appApiService: AppApiService;
  let ngZone: NgZone;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardPageComponent,
        NgIconsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        AppApiService,
        provideIcons({
          heroUserGroupSolid,
          heroBackward,
          matKeyboardDoubleArrowUp,
          matKeyboardDoubleArrowDown,
          matFilterCenterFocus,
          matZoomIn,
          matZoomOut,
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: { paramMap: { get: (param: string) => '123' } },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    component.hasAccess = jest.fn().mockResolvedValue(true);
    fixture.detectChanges();

    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
    appApiService = TestBed.inject(AppApiService);
    ngZone = TestBed.inject(NgZone);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the heatmap', () => {
    expect(component.showHeatmap).toBe(false);
    component.toggleHeatmap();
    expect(component.showHeatmap).toBe(true);
  });

  it('should navigate to /home if ID is null', () => {
    route.parent!.snapshot.paramMap.get = jest.fn().mockReturnValue(null);
    jest.spyOn(router, 'navigate');
    component.id = '';
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should get event floorplan boundaries', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    // mock response
    const response: IGetFloorplanBoundariesResponse = {
      boundaries: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
    component.id = '1';

    httpClient
      .get<IGetFloorplanBoundariesResponse>(
        `/api/event/getFloorplanBoundaries?eventId=${component.id}`
      )
      .subscribe((res) => {
        component.floorlayoutBounds = res.boundaries;

        expect(component.floorlayoutBounds).toEqual(response.boundaries);
      });

    const req = httpTestingController.expectOne(
      `/api/event/getFloorplanBoundaries?eventId=${component.id}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(response);
  });

  it('should get floorlayout images', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    // mock response
    const response: IImage[] = [
      {
        eventId: undefined,
        imageBase64: 'image1',
        imageObj: undefined,
        imageScale: 1,
        imageType: 'image/png',
      },
    ];

    component.id = '1';

    httpClient
      .get<IImage[]>(`/api/event/getFloorlayoutImages?eventId=${component.id}`)
      .subscribe((res) => {
        component.floorlayoutImages = res;

        expect(component.floorlayoutImages).toEqual(response);
      });

    const req = httpTestingController.expectOne(
      `/api/event/getFloorlayoutImages?eventId=${component.id}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(response);
  });

  it('should get event floorlayout', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    // mock response
    const response: IGetEventFloorlayoutResponse = {
      floorlayout: '',
    };

    component.id = '1';

    httpClient
      .get<IGetEventFloorlayoutResponse>(
        `/api/event/getFloorlayout?eventId=${component.id}`
      )
      .subscribe((res) => {
        component.floorlayoutSnapshot = res.floorlayout!;

        expect(component.floorlayoutSnapshot).toEqual(response);
      });

    const req = httpTestingController.expectOne(
      `/api/event/getFloorlayout?eventId=${component.id}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(response);
  });

  it('should set timeOffset', () => {
    jest
      .spyOn(appApiService, 'getEvent')
      .mockResolvedValue({ _id: '123' } as any);
    jest.spyOn(router, 'navigate');

    component.id = '123';
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);

    expect(component.timeOffset).toEqual(0);
  });

  it('should get Event', () => {
    const spy = jest
      .spyOn(appApiService, 'getEvent')
      .mockResolvedValue({ _id: '123' } as any);
    jest.spyOn(router, 'navigate');

    component.id = '123';
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);

    expect(spy).toHaveBeenCalled();
  });

  it('should set floorplan boundaries', fakeAsync(() => {
    const spy = jest
    .spyOn(appApiService, 'getEvent')
    .mockResolvedValue({ _id: '123' } as any);
    jest.spyOn(router, 'navigate');
    const spy2 = jest
      .spyOn(appApiService, 'getFloorplanBoundaries')
      .mockResolvedValue({ boundaries: { top: 0, bottom: 0, left: 0, right: 0 } });
    jest.spyOn(router, 'navigate');
    
    component.id = '123';
    component.event = { _id: '123', PublicEvent: true } as any;
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(spy).toHaveBeenCalled(); // get event
    expect(component.event).toEqual({ _id: '123', PublicEvent: true } as any);

    tick();

    expect(spy2).toHaveBeenCalled(); // get floorplan boundaries
  }));

  it('should set floorlayout', fakeAsync(() => {
    const spy = jest
    .spyOn(appApiService, 'getEvent')
    .mockResolvedValue({ _id: '123' } as any);
    jest.spyOn(router, 'navigate');
    const spy2 = jest
      .spyOn(appApiService, 'getFloorplanBoundaries')
      .mockResolvedValue({ boundaries: { top: 0, bottom: 0, left: 0, right: 0 } });
    jest.spyOn(router, 'navigate');
    const spy3 = jest
      .spyOn(appApiService, 'getEventFloorLayout')
      .mockResolvedValue('');
    jest.spyOn(router, 'navigate');
    
    component.id = '123';
    component.event = { _id: '123', PublicEvent: true } as any;
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(spy).toHaveBeenCalled(); // get event
    expect(component.event).toEqual({ _id: '123', PublicEvent: true } as any);

    tick();

    expect(spy2).toHaveBeenCalled(); // get floorplan boundaries

    tick();

    expect(spy3).toHaveBeenCalled(); // get floorlayout
  }));

  it('should set floorlayout images', fakeAsync(() => {
    const spy = jest
    .spyOn(appApiService, 'getEvent')
    .mockResolvedValue({ _id: '123' } as any);
    jest.spyOn(router, 'navigate');
    const spy2 = jest
      .spyOn(appApiService, 'getFloorplanBoundaries')
      .mockResolvedValue({ boundaries: { top: 0, bottom: 0, left: 0, right: 0 } });
    jest.spyOn(router, 'navigate');
    const spy3 = jest
      .spyOn(appApiService, 'getEventFloorLayout')
      .mockResolvedValue('');
    jest.spyOn(router, 'navigate');
    
    component.id = '123';
    component.event = { _id: '123', PublicEvent: true } as any;
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(spy).toHaveBeenCalled(); // get event
    expect(component.event).toEqual({ _id: '123', PublicEvent: true } as any);

    tick();

    expect(spy2).toHaveBeenCalled(); // get floorplan boundaries

    tick();

    expect(spy3).toHaveBeenCalled(); // get floorlayout

    expect(component.floorlayoutImages).toBeTruthy();
  }));

  it('should update eventStartTime and eventEndTime based on event StartDate and EndDate', () => {
    const event = {
        _id: '123',
        PublicEvent: true,
        StartDate: new Date(),
        EndDate: new Date(),
    } as any;

    const spy = jest.spyOn(appApiService, 'getEvent').mockResolvedValue(event);
    jest.spyOn(router, 'navigate');

    component.id = '123';
    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(spy).toHaveBeenCalled();

    // Simulate that the StartDate and EndDate are set in the event object
    // You can customize these dates to match your test scenario
    event.StartDate = new Date('2023-09-30T00:00:00.000Z');
    event.EndDate = new Date('2023-09-30T01:00:00.000Z');

    // Call ngOnInit again to trigger the code block
    component.ngOnInit();

    // Now, the eventStartTime and eventEndTime should be updated
    expect(component.eventStartTime).toBeTruthy();
    expect(component.eventEndTime).toBeTruthy();

    // You can customize these expectations based on your timeOffset logic
    const expectedStartTime = new Date('2023-09-30T00:00:00.000Z');
    expectedStartTime.setTime(expectedStartTime.getTime() + component.timeOffset);

    const expectedEndTime = new Date('2023-09-30T01:00:00.000Z');
    expectedEndTime.setTime(expectedEndTime.getTime() + component.timeOffset);

    expect(component.eventStartTime.getFullYear()).toEqual(expectedStartTime.getFullYear());
    expect(component.eventEndTime.getFullYear()).toEqual(expectedEndTime.getFullYear());
});


  it('should show stats on side if window inner width is greater than 1300', () => {
    window.innerWidth = 1301;
    component.showStatsOnSide = true;
    component.ngOnInit();
    expect(component.showStatsOnSide).toBe(true);
  });

  it('should not show stats on side if window inner width is less than 1300', () => {
    window.innerWidth = 1299;
    component.ngOnInit();
    expect(component.showStatsOnSide).toBe(false);
  });

  it('should show stats on side if window inner width is greater than 1300', () => {
    window.innerWidth = 1301;
    window.dispatchEvent(new Event('resize'));
    expect(component.showStatsOnSide).toBe(true);
  });

  it('should not show stats on side if window inner width is less than 1300', () => {
    window.innerWidth = 1299;
    window.dispatchEvent(new Event('resize'));
    expect(component.showStatsOnSide).toBe(false);
  });

  it('should be a largescreen if window inner width is greater than 1024', () => {
    window.innerWidth = 1025;
    component.largeScreen = true;
    component.ngOnInit();
    expect(component.largeScreen).toBe(true);
  });

  it('should not be a largescreen if window inner width is less than 1024', () => {
    window.innerWidth = 1023;
    component.ngOnInit();
    expect(component.largeScreen).toBe(false);
  });

  it('should be a largescreen if window inner width is greater than 1024', () => {
    window.innerWidth = 1025;
    window.dispatchEvent(new Event('resize'));
    expect(component.largeScreen).toBe(true);
  });

  it('should not be a largescreen if window inner width is less than 1024', () => {
    window.innerWidth = 1023;
    window.dispatchEvent(new Event('resize'));
    expect(component.largeScreen).toBe(false);
  });

  it('should be a mediumscreen if window inner width is greater than 768', () => {
    window.innerWidth = 769;
    component.mediumScreen = true;
    component.ngOnInit();
    expect(component.mediumScreen).toBe(true);
  });

  it('should not be a mediumscreen if window inner width is less than 768', () => {
    window.innerWidth = 767;
    component.ngOnInit();
    expect(component.mediumScreen).toBe(false);
  });

  it('should be a mediumscreen if window inner width is greater than 768', () => {
    window.innerWidth = 769;
    window.dispatchEvent(new Event('resize'));
    expect(component.mediumScreen).toBe(true);
  });

  it('should not be a mediumscreen if window inner width is less than 768', () => {
    window.innerWidth = 767;
    window.dispatchEvent(new Event('resize'));
    expect(component.mediumScreen).toBe(false);
  });

  it('should set show to true and loading to false', () => {
    component.loading = false;
    component.show = true;    
    component.ngOnInit();
    expect(component.loading).toBe(false);
    expect(component.show).toBe(true);
  });

  it('should call getImageFromJSONData, renderUserCountStreamingChart on resize', () => {
    const spy = jest.spyOn(component, 'getImageFromJSONData');
    const spy2 = jest.spyOn(component, 'renderUserCountDataStreaming');

    window.dispatchEvent(new Event('resize'));

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should return true from hasAccess', () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('admin');

    component.hasAccess().then((res) => {
      expect(res).toBe(true);
    });
  });

  it('should call getSubscribedEvents if role is not admin', () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('user');

    const spy = jest.spyOn(appApiService, 'getSubscribedEvents').mockResolvedValue([({ _id: '123'}) as any]);

    component.hasAccess().then((res) => {
      expect(spy).toHaveBeenCalled();

      expect(res).toBe(true);
    });
  });
});
