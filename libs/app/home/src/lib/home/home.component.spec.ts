import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HomeHelpComponent,
  ProfileComponent,
} from '@event-participation-trends/app/components';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroChartBar,
  heroPencil,
  heroArrowsRightLeft,
} from '@ng-icons/heroicons/outline';
import {
  matFormatListBulletedRound,
  matBarChartRound,
  matDrawRound,
  matQuestionMarkRound,
  matGroupRound,
  matEventRound,
  matCompareArrowsRound,
} from '@ng-icons/material-icons/round';

import { matMenu, matClose } from '@ng-icons/material-icons/baseline';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

enum Tab {
  Events = 'events',
  Users = 'users',
  Compare = 'compare',
  None = '',
}

enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Viewer = 'viewer',
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let appApiService: AppApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ProfileComponent,
        HomeHelpComponent,
        NgIconsModule,
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
          matGroupRound,
          matEventRound,
          matCompareArrowsRound,
          heroArrowsRightLeft,
          matMenu,
          matClose,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should showEvents', () => {
    component.showEvents();

    expect(component.expandEvents).toBe(true);
    expect(component.overflowEvents).toBe(true);
  });

  it('should hideEvents', () => {
    component.hideEvents();

    expect(component.expandEvents).toBe(false);
    setTimeout(() => {
      expect(component.overflowEvents).toBe(false);
    }, 300);
  });

  it('should showCompare', () => {
    component.showCompare();

    expect(component.expandCompare).toBe(true);
    expect(component.overflowCompare).toBe(true);
  });

  it('should hideCompare', () => {
    component.hideCompare();

    expect(component.expandCompare).toBe(false);
    setTimeout(() => {
      expect(component.overflowCompare).toBe(false);
    }, 300);
  });

  it('should showUsers', () => {
    component.showUsers();

    expect(component.expandUsers).toBe(true);
    expect(component.overflowUsers).toBe(true);
  });

  it('should hideUsers', () => {
    component.hideUsers();

    expect(component.expandUsers).toBe(false);
    setTimeout(() => {
      expect(component.overflowUsers).toBe(false);
    }, 300);
  });

  it('should showHelp', () => {
    component.showHelp();

    expect(component.expandHelp).toBe(true);
    expect(component.overflowHelp).toBe(true);
  });

  it('should hideHelp', () => {
    component.hideHelp();

    expect(component.expandHelp).toBe(false);
    setTimeout(() => {
      expect(component.overflowHelp).toBe(false);
    }, 300);
  });

  it('should call getProfilePicUrl', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  }));

  it('should call getRole', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getRole');

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  }));

  it('should call getUserName', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getUserName');

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  }));

  it('should set the role to admin', waitForAsync(async () => {
    const mockResponse = {
      role: 'admin',
    };

    await component.ngOnInit();

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(component.role).toEqual(Role.Admin);
  }));

  it('should set the role to manager', waitForAsync(async () => {
    const mockResponse = {
      role: 'manager',
    };

    await component.ngOnInit();

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse.role);

    expect(component.role).toEqual(Role.Manager);
  }));

  it('should set the role to viewer', waitForAsync(async () => {
    const mockResponse = {
      role: 'viewer',
    };

    await component.ngOnInit();

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(component.role).toEqual(Role.Viewer);
  }));

  it('should set the role to viewer if no role is returned', waitForAsync(async () => {
    const mockResponse = {
      role: '',
    };

    await component.ngOnInit();

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse.role);

    expect(component.role).toEqual(Role.Viewer);
  }));

  it('should set tab to users', waitForAsync(async () => {
    // set the window location
    window.location.href = 'localhost:4200/home/users';

    await component.ngOnInit();

    expect(component.tab).toEqual(Tab.Users);
  }));

  it('should set tab to events', waitForAsync(async () => {
    // set the window location
    window.location.href = 'localhost:4200/home/events';

    await component.ngOnInit();

    expect(component.tab).toEqual(Tab.Events);
  }));

  it('should set tab to compare', waitForAsync(async () => {
    // set the window location
    window.location.href = 'localhost:4200/home/compare';

    await component.ngOnInit();

    expect(component.tab).toEqual(Tab.Compare);
  }));

  it('should set tab to event if no page specified', waitForAsync(async () => {
    // set the window location
    window.location.href = 'localhost:4200/home';

    await component.ngOnInit();

    expect(component.tab).toEqual(Tab.Events);
  }));

  it('should set showMenuBar to false if window size is less than 1024px', waitForAsync(async () => {
    window.innerWidth = 1023;

    await component.ngOnInit();

    expect(component.showMenuBar).toEqual(false);
  }));

  it('should set showMenuBar to true if window size is greater than 1024px', waitForAsync(async () => {
    window.innerWidth = 1025;

    await component.ngOnInit();

    expect(component.showMenuBar).toEqual(true);
  }));

  it('should call getProfilePicUrl, getRole and set tab to users while showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1025;
    window.location.href = 'localhost:4200/home/users';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Users);
    expect(component.showMenuBar).toEqual(true);
  }));

  it('should call getProfilePicUrl, getRole and set tab to events while showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1025;
    window.location.href = 'localhost:4200/home/events';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Events);
    expect(component.showMenuBar).toEqual(true);
  }));

  it('should call getProfilePicUrl, getRole and set tab to compare while showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1025;
    window.location.href = 'localhost:4200/home/compare';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Compare);
    expect(component.showMenuBar).toEqual(true);
  }));

  it('should call getProfilePicUrl, getRole and set tab to events while not showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1023;
    window.location.href = 'localhost:4200/home/events';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Events);
    expect(component.showMenuBar).toEqual(false);
  }));

  it('should call getProfilePicUrl, getRole and set tab to users while not showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1023;
    window.location.href = 'localhost:4200/home/users';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Users);
    expect(component.showMenuBar).toEqual(false);
  }));

  it('should call getProfilePicUrl, getRole and set tab to compare while not showing the menu bar', waitForAsync(async () => {
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    const spy2 = jest.spyOn(appApiService, 'getRole');

    window.innerWidth = 1023;
    window.location.href = 'localhost:4200/home/compare';

    await component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();  
    expect(component.tab).toEqual(Tab.Compare);
    expect(component.showMenuBar).toEqual(false);
  }));

  it('should return true if role is manager', () => {
    component.role = Role.Manager;

    expect(component.isManager()).toEqual(true);
  });

  it('should return true if role is admin', () => {
    component.role = Role.Admin;

    expect(component.isAdmin()).toEqual(true);
  });

  it('should return false if role is viewer', () => {
    component.role = Role.Viewer;

    expect(component.isAdmin()).toEqual(false);
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

  it('should set tab to events', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(component, 'hideNavBar');

    component.navBarVisible = true;
    component.events();

    expect(component.tab).toEqual(Tab.Events);
    expect(spy).toHaveBeenCalled();
    expect(component.navBarVisible).toBeFalsy();
    expect(spy2).toHaveBeenCalled();
  });

  it('should set tab to users', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(component, 'hideNavBar');

    component.navBarVisible = true;
    component.users();

    expect(component.tab).toEqual(Tab.Users);
    expect(spy).toHaveBeenCalled();
    expect(component.navBarVisible).toBeFalsy();
    expect(spy2).toHaveBeenCalled();
  });

  it('should set tab to compare', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(component, 'hideNavBar');

    component.navBarVisible = true;
    component.compare();

    expect(component.tab).toEqual(Tab.Compare);
    expect(spy).toHaveBeenCalled();
    expect(component.navBarVisible).toBeFalsy();
    expect(spy2).toHaveBeenCalled();
  });

  it('should press profile button', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(component, 'showProfile');

    component.profile_press();

    expect(spy).toHaveBeenCalled();
    setTimeout(() => {
      expect(spy2).toHaveBeenCalled();
    }, 100);
  });

  it('should press home button', () => {
    const spy = jest.spyOn(component, 'pressButton');
    const spy2 = jest.spyOn(router, 'navigate');

    component.home_press();

    expect(spy).toHaveBeenCalled();
    setTimeout(() => {
      expect(spy2).toHaveBeenCalledWith(['/']);
    }, 100);
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

  it('should return true if tab is events', () => {
    component.tab = Tab.Events;

    expect(component.onEvents()).toBeTruthy();
  });

  it('should return false if tab is not events', () => {
    component.tab = Tab.Users;

    expect(component.onEvents()).toBeFalsy();
  });

  it('should return true if tab is users', () => {
    component.tab = Tab.Users;

    expect(component.onUsers()).toBeTruthy();
  });

  it('should return false if tab is not users', () => {
    component.tab = Tab.Events;

    expect(component.onUsers()).toBeFalsy();
  });

  it('should return true if tab is compare', () => {
    component.tab = Tab.Compare;

    expect(component.onCompare()).toBeTruthy();
  });

  it('should return false if tab is not compare', () => {
    component.tab = Tab.Events;

    expect(component.onCompare()).toBeFalsy();
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
