import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestAccessModalComponent } from './request-access-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient } from '@angular/common/http';

describe('RequestAccessModalComponent', () => {
  let component: RequestAccessModalComponent;
  let fixture: ComponentFixture<RequestAccessModalComponent>;
  let appApiService: AppApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessModalComponent, HttpClientTestingModule],
      providers: [AppApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the event id', () => {
    component.setEventId('test');
    expect(component.event_id).toEqual('test');
  });

  it('should get the button name', () => {
    component.setEventId('test');
    expect(component.getButtonName()).toEqual('request-access-test');
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

  it('should get the request modal id', () => {
    const event = { _id: 'test' };
    expect(component.getRequestModalId(event)).toEqual('request-modal-test');
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

  it('should close modal after sending request', () => {
    const modal = document.createElement('div');
    modal.id = 'request-modal-test';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    const pressButtonSpy = jest.spyOn(component, 'pressButton');
    const closeModalSpy = jest.spyOn(component, 'closeModal');

    component.sendRequest();

    expect(pressButtonSpy).toHaveBeenCalled();

    setTimeout(() => {
      expect(closeModalSpy).toHaveBeenCalled();
    }, 300);
  });

  it('should send request', () => {
    const mockResponse = { message: 'success' };
    component.setEventId('test');

    component.sendRequest();

    const req = httpTestingController.expectOne('/api/event/sendViewRequest');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ eventId: 'test' });

    req.flush(mockResponse);

    httpTestingController.verify();
  });
});
