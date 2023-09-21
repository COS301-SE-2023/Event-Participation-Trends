import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventViewComponent } from './event-view.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroChartBar, heroPencil } from '@ng-icons/heroicons/outline';
import { matFormatListBulletedRound, matBarChartRound, matDrawRound, matQuestionMarkRound } from '@ng-icons/material-icons/round';
import { matMenu, matClose } from '@ng-icons/material-icons/baseline';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient } from '@angular/common/http';
import { IGetUserRoleResponse } from '@event-participation-trends/api/user/util';
import { DashboardPageComponent, EventDetailsPageComponent, EventHelpComponent, SmallScreenModalComponent } from '@event-participation-trends/app/components';

describe('EventViewComponent', () => {
  let component: EventViewComponent;
  let fixture: ComponentFixture<EventViewComponent>;
  let router: Router;
  let appApiService: AppApiService;
  let route: ActivatedRoute;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventViewComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgIconsModule, DashboardPageComponent, EventHelpComponent, EventDetailsPageComponent, SmallScreenModalComponent],
      providers: [
        AppApiService,
        provideIcons({heroArrowLeft, heroChartBar, heroPencil, matFormatListBulletedRound, matBarChartRound, matDrawRound, matQuestionMarkRound, matMenu, matClose})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    appApiService = TestBed.inject(AppApiService);
    route = TestBed.inject(ActivatedRoute);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show back button', () => {
    component.showBack();
    expect(component.expandBack).toBeTruthy();
    expect(component.overflowBack).toBeTruthy();
  });

  it('should hide back button', () => {
    component.hideBack();
    expect(component.expandBack).toBeFalsy();
    expect(component.overflowBack).toBeFalsy();
  });

  it('should show help button', () => {
    component.showHelp();
    expect(component.expandHelp).toBeTruthy();
    expect(component.overflowHelp).toBeTruthy();
  });

  it('should hide help button', () => {
    component.hideHelp();
    expect(component.expandHelp).toBeFalsy();
    expect(component.overflowHelp).toBeFalsy();
  });

  it('should show dashboard tab', () => {
    component.showDashboard();
    expect(component.expandDashboard).toBeTruthy();
    expect(component.overflowDashboard).toBeTruthy();
  });

  it('should hide dashboard tab', () => {
    component.hideDashboard();
    expect(component.expandDashboard).toBeFalsy();
    expect(component.overflowDashboard).toBeFalsy();
  });

  it('should show details tab', () => {
    component.showDetails();
    expect(component.expandDetails).toBeTruthy();
    expect(component.overflowDetails).toBeTruthy();
  });

  it('should hide details tab', () => {
    component.hideDetails();
    expect(component.expandDetails).toBeFalsy();
    expect(component.overflowDetails).toBeFalsy();
  });

  it('should show floorplan tab', () => {
    component.showFloorplan();
    expect(component.expandFloorplan).toBeTruthy();
    expect(component.overflowFloorplan).toBeTruthy();
  });

  it('should hide floorplan tab', () => {
    component.hideFloorplan();
    expect(component.expandFloorplan).toBeFalsy();
    expect(component.overflowFloorplan).toBeFalsy();
  });

  it(`should navigate to '/home' when 'goBack()' is called`, () => {
    const spy = jest.spyOn(router, 'navigate');

    component.goBack();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

  it('should make a call to get the role if an ID is available', () => {
    //spy on route snapshot
    //mock return value of paramMap.get('id')
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('test');

    const spy = jest.spyOn(appApiService, 'getRole').mockResolvedValue('viewer');

    component.id = 'test';
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should not make a call to get the role if an ID is not available', () => {
    //spy on route snapshot
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
    const spy = jest.spyOn(appApiService, 'getRole').mockResolvedValue('viewer');

    component.id = null;
    component.ngOnInit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should add "hover:scale-[80%]" class to target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    document.body.appendChild(target);

    component.pressButton('#test');

    expect(target.classList.contains('hover:scale-[80%]')).toBeTruthy();
  });

  it('should remove "hover:scale-[80%]" class from target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    target.classList.add('hover:scale-[80%]');
    document.body.appendChild(target);

    component.pressButton('#test');

    setTimeout(() => {
      expect(target.classList.contains('hover:scale-[80%]')).toBeFalsy();
    }, 1000);
  });

  it('shoud go to dashboard when dashboard button is pressed', () => {
    component.goDashboard();
    expect(component.tab).toEqual('dashboard');
  });

  it('shoud go to details when details button is pressed', () => {
    component.goDetails();
    expect(component.tab).toEqual('details');
  });

  it('shoud go to floorplan when floorplan button is pressed', () => {
    //set window innerWidth to 1152px
    window.innerWidth = 1152;
    component.goFloorplan();
    expect(component.tab).toEqual('floorplan');
  });

  it('shoud not go to floorplan when screenwidth is too small', () => {
    //set window innerWidth to 1151px - minimum limit is 1152px
    window.innerWidth = 1151;
    const spy = jest.spyOn(router, 'navigate');

    component.goFloorplan();
    expect(component.tab).not.toEqual('floorplan');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should navigate to home when "goBack()" is called', () => {
    const spy = jest.spyOn(router, 'navigate');

    component.goBack();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });
});
