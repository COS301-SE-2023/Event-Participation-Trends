import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown } from "@ng-icons/material-icons/baseline";
import { matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";
import { IGetEventFloorlayoutResponse, IGetFloorplanBoundariesResponse, IImage } from '@event-participation-trends/api/event/util';
import { HttpClient } from '@angular/common/http';
import { AppApiService } from '@event-participation-trends/app/api';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let router: Router;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, NgIconsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppApiService,
        provideIcons({heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matFilterCenterFocus, matZoomIn, matZoomOut})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
    appApiService = TestBed.inject(AppApiService);
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
    jest.spyOn(router, 'navigate');
    component.id = '';
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should get event floorplan boundaries', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);
    // mock response
    const response: IGetFloorplanBoundariesResponse = {
      boundaries: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };
    component.id = '1';

    httpClient.get<IGetFloorplanBoundariesResponse>(`/api/event/getFloorplanBoundaries?eventId=${component.id}`).subscribe(res => {
      component.floorlayoutBounds = res.boundaries;

      expect(component.floorlayoutBounds).toEqual(response.boundaries);
    });

    const req = httpTestingController.expectOne(`/api/event/getFloorplanBoundaries?eventId=${component.id}`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });

  it('should get floorlayout images', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);
    // mock response
    const response: IImage[] =[
      {
        eventId: undefined,
        imageBase64: 'image1',
        imageObj: undefined,
        imageScale: 1,
        imageType: 'image/png',
      }
    ];

    component.id = '1';

    httpClient.get<IImage[]>(`/api/event/getFloorlayoutImages?eventId=${component.id}`).subscribe(res => {
      component.floorlayoutImages = res;

      expect(component.floorlayoutImages).toEqual(response);
    });

    const req = httpTestingController.expectOne(`/api/event/getFloorlayoutImages?eventId=${component.id}`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });

  it('should get event floorlayout', () => {
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne(`/api/user/getRole`);
    // mock response
    const response: IGetEventFloorlayoutResponse = {
      floorlayout: ''
    };

    component.id = '1';

    httpClient.get<IGetEventFloorlayoutResponse>(`/api/event/getFloorlayout?eventId=${component.id}`).subscribe(res => {
      component.floorlayoutSnapshot = res.floorlayout!;

      expect(component.floorlayoutSnapshot).toEqual(response);
    });

    const req = httpTestingController.expectOne(`/api/event/getFloorlayout?eventId=${component.id}`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);

    httpTestingController.verify();
  });
});
