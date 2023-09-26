import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileComponent } from '@event-participation-trends/app/components';
import { AppApiService } from '@event-participation-trends/app/api';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, ProfileComponent],
      providers: [AppApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appApiService.getUserName() on ngOnInit', () => {
    const spy = jest.spyOn(appApiService, 'getUserName');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should not be logged in if username is empty', () => {
    jest.spyOn(appApiService, 'getUserName').mockResolvedValue('');
    component.ngOnInit();
    expect(component.loggedIn).toBe(false);
  });

  it('should append script tag to head if username not available', () => {
    jest.spyOn(appApiService, 'getUserName').mockResolvedValue('');
    component.ngOnInit();
    fixture.detectChanges();
    const script = document.querySelector('script');
    expect(script?.src).toEqual('https://accounts.google.com/gsi/client');
  });

  it('should not call appApiService.getProfilePicUrl() if username not available', () => {
    jest.spyOn(appApiService, 'getUserName').mockResolvedValue('');
    const spy = jest.spyOn(appApiService, 'getProfilePicUrl');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set gradient element background image on mousemove', () => {
    //create div element
    const div = document.createElement('div');
    div.innerHTML = '<div id="gradient"></div>';
    document.body.appendChild(div);
    fixture.detectChanges();

    //call mousemove event
    const gradient = document.getElementById('gradient') as HTMLDivElement;
    gradient.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    fixture.detectChanges();
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

  it('should show profile modal', () => {
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.classList.add('hidden');
    modal.classList.add('opacity-0');
    document.body.appendChild(modal);

    component.showProfile();

    setTimeout(() => {
      expect(modal.classList.contains('hidden')).toBeFalsy();
      expect(modal.classList.contains('opacity-0')).toBeFalsy();
    }, 100);
  });

  it('should call pressButton() and showProfile() on profile_press()', () => {
    const pressButtonSpy = jest.spyOn(component, 'pressButton');
    const showProfileSpy = jest.spyOn(component, 'showProfile');

    component.profile_press();

    expect(pressButtonSpy).toHaveBeenCalled();
    setTimeout(() => {
      expect(showProfileSpy).toHaveBeenCalled();
    }, 100);
  });
});
