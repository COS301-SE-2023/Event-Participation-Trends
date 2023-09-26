import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { EventViewComponent } from './event-view.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroChartBar,
  heroPencil,
} from '@ng-icons/heroicons/outline';
import {
  matFormatListBulletedRound,
  matBarChartRound,
  matDrawRound,
  matQuestionMarkRound,
} from '@ng-icons/material-icons/round';
import { matMenu, matClose } from '@ng-icons/material-icons/baseline';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient } from '@angular/common/http';
import { IGetUserRoleResponse } from '@event-participation-trends/api/user/util';
import {
  DashboardPageComponent,
  EventDetailsPageComponent,
  EventHelpComponent,
  SmallScreenModalComponent,
} from '@event-participation-trends/app/components';

enum Tab {
  Dashboard = 'dashboard',
  Details = 'details',
  Floorplan = 'floorplan',
  Streaming = 'streaming',
  None = '',
}

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
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgIconsModule,
        DashboardPageComponent,
        EventHelpComponent,
        EventDetailsPageComponent,
        SmallScreenModalComponent,
      ],
      providers: [
        AppApiService,
        provideIcons({
          heroArrowLeft,
          heroChartBar,
          heroPencil,
          matFormatListBulletedRound,
          matBarChartRound,
          matDrawRound,
          matQuestionMarkRound,
          matMenu,
          matClose,
        }),
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

  it('should set overflow help to false after 300ms when hideBack() is called', fakeAsync(() => {
    component.hideBack();
    tick(300);
    expect(component.overflowHelp).toBeFalsy();
  }));

  it('should set overflow help to false after 300ms when hideHelp() is called', fakeAsync(() => {
    component.hideHelp();
    tick(300);
    expect(component.overflowHelp).toBeFalsy();
  }));

  it('should set overflow help to false after 300ms when hideDashboard() is called', fakeAsync(() => {
    component.hideDashboard();
    tick(300);
    expect(component.overflowHelp).toBeFalsy();
  }));

  it('should set overflow help to false after 300ms when hidDetails) is called', fakeAsync(() => {
    component.hideDetails();
    tick(300);
    expect(component.overflowHelp).toBeFalsy();
  }));

  it('should set overflow help to false after 300ms when hideFloorplan() is called', fakeAsync(() => {
    component.hideFloorplan();
    tick(300);
    expect(component.overflowHelp).toBeFalsy();
  }));

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

    const spy = jest
      .spyOn(appApiService, 'getRole')
      .mockResolvedValue('viewer');

    component.id = 'test';
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should not make a call to get the role if an ID is not available', () => {
    //spy on route snapshot
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
    const spy = jest
      .spyOn(appApiService, 'getRole')
      .mockResolvedValue('viewer');

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
    }, 100);
  });

  it('shoud go to dashboard when dashboard button is pressed', () => {
    const spy = jest.spyOn(component, 'hideNavBar');
    
    component.goDashboard();
    expect(component.tab).toEqual('dashboard');
    component.navBarVisible = true;
    expect(component.navBarVisible).toBeTruthy();
  });

  it('shoud go to details when details button is pressed', () => {
    const spy = jest.spyOn(component, 'hideNavBar');
    
    component.goDetails();
    expect(component.tab).toEqual('details');
    component.navBarVisible = true;
    expect(component.navBarVisible).toBeTruthy();
  });

  it('shoud go to floorplan when floorplan button is pressed', () => {
    const spy = jest.spyOn(component, 'hideNavBar');
    
    //set window innerWidth to 1152px
    window.innerWidth = 1152;
    component.goFloorplan();
    expect(component.tab).toEqual('floorplan');
    component.navBarVisible = true;
    expect(component.navBarVisible).toBeTruthy();
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

  it('should set manager access to true if role is admin', fakeAsync(() => {
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('test');

    const spy = jest.spyOn(appApiService, 'getRole').mockResolvedValue('admin');

    component.id = 'test';

    component.ngOnInit();

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush({ userRole: 'admin' } as IGetUserRoleResponse);

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.manager_access).toBeTruthy();
  }));

  it('should call getManagedEvents if role is manager', fakeAsync(() => {
    const mockManagedEvents = [{ _id: '1' }, { _id: '2' }];

    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');

    const spy = jest
      .spyOn(appApiService, 'getRole')
      .mockResolvedValue('manager');
    const spy2 = jest
      .spyOn(appApiService, 'getManagedEvents')
      .mockResolvedValue(mockManagedEvents.map((event: any) => event._id));

    component.id = '1';

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush({ userRole: 'manager' } as IGetUserRoleResponse);

    component.ngOnInit();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.manager_access).toBeFalsy();
  }));

  it('should set showMenuBar to false if window.innerWidth is less than 1024', () => {
    window.innerWidth = 1023;
    component.ngOnInit();
    expect(component.showMenuBar).toBeFalsy();
  });

  it('should showSmallScreenModal', () => {
    const modal = document.createElement('div');
    modal.id = 'small-screen-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    component.showSmallScreenModal();

    setTimeout(() => {
      expect(modal.classList.contains('hidden')).toBeFalsy();
      expect(modal.classList.contains('opacity-0')).toBeFalsy();
    }, 100);
  });

  it('should closeSmallScreenModal', () => {
    const modal = document.createElement('div');
    modal.id = 'small-screen-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    component.closeSmallScreenModal();

    setTimeout(() => {
      expect(modal.classList.contains('hidden')).toBeTruthy();
      expect(modal.classList.contains('opacity-0')).toBeTruthy();
    }, 100);
  });

  it('should showHelpModal', () => {
    const modal = document.createElement('div');
    modal.id = 'help-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    component.showHelpModal();

    setTimeout(() => {
      expect(modal.classList.contains('hidden')).toBeFalsy();
      expect(modal.classList.contains('opacity-0')).toBeFalsy();
    }, 100);
  });

  it('should be on floorplan', () => {
    component.tab = Tab.Floorplan ;
    expect(component.onFloorplan()).toBeTruthy();
  });

  it('should be on details', () => {
    component.tab = Tab.Details ;
    expect(component.onDetails()).toBeTruthy();
  });

  it('should be on dashboard', () => {
    component.tab = Tab.Dashboard ;
    expect(component.onDashboard()).toBeTruthy();
  });

  it('should press help button', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(component, 'showHelpModal');

    component.help_press();

    expect(spy).toHaveBeenCalled();
    setTimeout(() => {
      expect(spy2).toHaveBeenCalled();
    });
  });

  it('should be active route', () => {
    const spy = jest.spyOn(router, 'url', 'get').mockReturnValue('/event/1');

    const res = component.isActiveRoute('/event/1');

    expect(spy).toHaveBeenCalled();
    expect(res).toBeTruthy();
  });

  it('should set showMenuBar to true and navBarVisible to false on resize with window.innerWidth greater than 1024', () => {
    window.innerWidth = 1025;
    window.dispatchEvent(new Event('resize'));

    expect(component.showMenuBar).toBeTruthy();
    expect(component.navBarVisible).toBeFalsy();
  });

  it('should set showMenuBar to false on resize with window.innerWidth less than 1024', () => {
    window.innerWidth = 1023;
    window.dispatchEvent(new Event('resize'));

    expect(component.showMenuBar).toBeFalsy();
  });

  it('should showNavBar', () => {
    const element = document.createElement('div');
    element.id = 'navbar';
    document.body.appendChild(element);

    component.showNavBar();

    expect(element.style.width).toEqual('390px');
    expect(component.navBarVisible).toBeTruthy();
  });

  it('should hideNavBar', () => {
    const element = document.createElement('div');
    element.id = 'navbar';
    document.body.appendChild(element);

    component.hideNavBar();

    expect(component.navBarVisible).toBeFalsy();
  });
});
