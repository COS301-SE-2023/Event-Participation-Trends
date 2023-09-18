import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { UsersPageComponent } from './users-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppApiService } from '@event-participation-trends/app/api';
import { IGetUsersResponse, Status } from '@event-participation-trends/api/user/util';
import { HttpClient } from '@angular/common/http';

describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPageComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppApiService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    appApiService = TestBed.inject(AppApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return user\'s full name', () => {
    const user = {
      FirstName: 'John',
      LastName: 'Doe'
    };

    expect(component.getName(user)).toEqual('John Doe');
  });

  it('should call updateRole when clicking SetViewer', () => {
    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      Role: 'manager'
    };

    jest.spyOn(component, 'updateRole');
    component.setViewer(user);
    expect(component.updateRole).toHaveBeenCalledWith({...user, Role: 'viewer'});
  });
  
  it('should call updateRole when clicking SetManager', () => {
    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      Role: 'viewer'
    };

    jest.spyOn(component, 'updateRole');
    component.setManager(user);
    expect(component.updateRole).toHaveBeenCalledWith({...user, Role: 'manager'});
  });

  it('should make a call to UpdateUserRole', fakeAsync(() => {
    const response = {
      status: Status.SUCCESS
    };

    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      Role: 'viewer'
    };

    component.updateRole(user);

    const req = httpTestingController.expectOne(`/api/user/updateUserRole`);
    expect(req.request.method).toEqual('POST');

    req.flush(response);
  }));

  it('should return a list of users', fakeAsync(() => {
    const response = [
      {
        FirstName: 'John',
        LastName: 'Doe',
        Role: 'viewer',
        Email: 'john@gmail.com'
      },
      {
        FirstName: 'Jane',
        LastName: 'Doe',
        Role: 'manager',
        Email: 'jane@gmail.com'
      }
    ];

    component.users = response;
    component.search = 'John';

    expect(component.get_users()).toEqual([response[0]]);
  }));

  it('should set users array', () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('admin');
    
    component.ngOnInit();

    const endpoint = '/api/user/getAllUsers';
    const httpClient: HttpClient = TestBed.inject(HttpClient);
    httpClient.get<IGetUsersResponse>(endpoint).subscribe((response) => {
      component.users = response.users;

      expect(component.users).toEqual(response.users);
    });
  });

  //tests for the resizing of the window
  it('should change ViewerText to V and ManagerText to M when the screen is small', () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    expect(component.viewerText).toEqual('V');
    expect(component.managerText).toEqual('M');
  });

  it('should set largeScreen to true when the screen is large', () => {
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));

    expect(component.largeScreen).toEqual(true);
  });
});
