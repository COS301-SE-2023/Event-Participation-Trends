import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { AppApiService } from '@event-participation-trends/app/api';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let cookieService: CookieService;
  let appApiService: AppApiService;

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
    }, 100);
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

  it('should call getFullName', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    jest.spyOn(appApiService, 'getFullName');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getFullName).toHaveBeenCalled();
  }));

  it('should call getProfilePicUrl', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    jest.spyOn(appApiService, 'getProfilePicUrl');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getProfilePicUrl).toHaveBeenCalled();
  }));

  it('should call getRole', waitForAsync(async () => {
    // Configure the real API service method to return a promise
    jest.spyOn(appApiService, 'getRole');

    await component.ngOnInit(); // Use await to wait for the async ngOnInit to complete

    expect(appApiService.getRole).toHaveBeenCalled();
  }));
});
