import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient } from '@angular/common/http';
import { IGetFullNameResponse } from '@event-participation-trends/api/user/util';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let cookieService: CookieService;
  let appApiService: AppApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule],
      providers: [
        CookieService,
        AppApiService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    cookieService = TestBed.inject(CookieService);
    appApiService = TestBed.inject(AppApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add "hover:scale-90" class to target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    document.body.appendChild(target);

    component.pressButton('#test');

    expect(target.classList.contains('hover:scale-90')).toBeTruthy();
  });

  it('should remove "hover:scale-90" class from target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    target.classList.add('hover:scale-90');
    document.body.appendChild(target);

    component.pressButton('#test');

    setTimeout(() => {
      expect(target.classList.contains('hover:scale-90')).toBeFalsy();
    }, 1000);
  });

  it('should close modal', () => {
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    component.closeModal();

    expect(modal.classList.contains('opacity-0')).toBeTruthy();
    expect(modal.classList.contains('hidden')).toBeTruthy();
  });

  it('should logout', () => {
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    const pressButtonSpy = jest.spyOn(component, 'pressButton');
    const closeModalSpy = jest.spyOn(component, 'closeModal');

    component.logout();

    expect(pressButtonSpy).toHaveBeenCalled();
    expect(closeModalSpy).toHaveBeenCalled();
    expect(cookieService.get('jwt')).toBe('');
    expect(cookieService.get('csrf')).toBe('');
  });

  it('should redirect to login page', () => {
    component.logout();

    expect(window.location.href).toBe('http://localhost/');
  });


  it('should call getFullName', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    const mockResponse = 'test';
    jest.spyOn(appApiService, 'getFullName').mockResolvedValue(mockResponse);

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getFullName).toHaveBeenCalled();
    expect(component.name).toEqual(mockResponse);
  }));

  it('should call getProfilePicUrl', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    const mockResponse = 'test';
    jest.spyOn(appApiService, 'getProfilePicUrl').mockResolvedValue(mockResponse);

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getProfilePicUrl).toHaveBeenCalled();
    expect(component.img_url).toEqual(mockResponse);
  }));

  it('should call getRole', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    const mockResponse = 'test';
    jest.spyOn(appApiService, 'getRole').mockResolvedValue(mockResponse);

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getRole).toHaveBeenCalled();
    expect(component.role).toEqual(mockResponse);
  }));

  it('should set Role to Administrator', waitForAsync(async () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('admin');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(component.role).toEqual('Administrator');
  }));

  it('should set Role to Manager', waitForAsync(async () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('manager');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(component.role).toEqual('Manager');
  }));

  it('should set Role to Viewer', waitForAsync(async () => {
    jest.spyOn(appApiService, 'getRole').mockResolvedValue('viewer');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(component.role).toEqual('Viewer');
  }));

  // ========================
  // Integration Tests
  // ========================
  it('should call getFullName endpoint and set name', () => {
    // expect the same call from the ngOnInit test
    httpTestingController.expectOne(`/api/user/getFullName`);

    const mockResponse = 'test';
    httpClient.get<IGetFullNameResponse>('/api/user/getFullName').subscribe((response) => {
      component.name = response.fullName!;
      
      expect(response.fullName).toEqual(mockResponse);
      expect(component.name).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/getFullName');
    expect(req.request.method).toEqual('GET');
    req.flush({ fullName: mockResponse });

    httpTestingController.verify();
  });

  it('should call getProfilePicUrl endpoint and set img_url', () => {
    // expect the same call from the ngOnInit test
    httpTestingController.expectOne(`/api/user/getFullName`);

    const mockResponse = 'test';
    httpClient.get<string>('/api/user/getProfilePicUrl').subscribe((response) => {
      component.img_url = response;
      
      expect(response).toEqual(mockResponse);
      expect(component.img_url).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/getProfilePicUrl');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    httpTestingController.verify();
  });

  it('should call getRole endpoint and set role', () => {
    // expect the same call from the ngOnInit test
    httpTestingController.expectOne(`/api/user/getFullName`);

    const mockResponse = 'test';
    httpClient.get<string>('/api/user/getRole').subscribe((response) => {
      component.role = response;
      
      expect(response).toEqual(mockResponse);
      expect(component.role).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/getRole');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    httpTestingController.verify();
  });
});
