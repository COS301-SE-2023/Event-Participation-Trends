import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EventDetailsPage } from './eventdetails.page';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import {
  ModalController,
  AngularDelegate,
  AlertController,
} from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { Status } from '@event-participation-trends/api/user/util';
import { IAcceptViewRequestResponse } from '@event-participation-trends/api/event/util';

describe('EventDetailsPage', () => {
  let component: EventDetailsPage;
  let fixture: ComponentFixture<EventDetailsPage>;
  let requestAccessModal_component: RequestAccessModalComponent;
  let fixture_requestAccessModal: ComponentFixture<RequestAccessModalComponent>;

  let modalController: ModalController;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetailsPage],
      imports: [NgxsModule.forRoot([]), HttpClientModule, RouterTestingModule],
      providers: [
        ModalController,
        AngularDelegate,
        Store,
        AppApiService,
        AlertController,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPage);
    component = fixture.componentInstance;

    fixture_requestAccessModal = TestBed.createComponent(
      RequestAccessModalComponent
    );
    requestAccessModal_component = fixture_requestAccessModal.componentInstance;

    fixture.detectChanges();

    modalController = TestBed.inject(ModalController);
    appApiService = TestBed.inject(AppApiService);
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // Create a integration test case to test when there is an access request available for the event, that the Api service works for accepting or declining the request
  it('should accept access request and remove it', fakeAsync(() => {
    const accessRequest = { Email: 'test@example.com' };
    const eventId = '123';
    const mockResponse: IAcceptViewRequestResponse = {
      status: Status.SUCCESS,
    };

    jest
      .spyOn(appApiService, 'acceptAccessRequest')
      .mockResolvedValue(mockResponse.status);
    jest.spyOn(component, 'removeRequest');

    component.event = { _id: eventId };
    component.acceptRequest(accessRequest);

    tick(); // Simulate the passage of time until all asynchronous operations are complete

    expect(appApiService.acceptAccessRequest).toHaveBeenCalledWith({
      userEmail: accessRequest.Email,
      eventId: eventId,
    });
    expect(component.removeRequest).toHaveBeenCalledWith(accessRequest);
  }));  
  
  it('should decline access request and remove it', fakeAsync(() => {
    const accessRequest = { Email: 'test@example.com' };
    const eventId = '123';
    const mockResponse: IAcceptViewRequestResponse = {
      status: Status.FAILURE,
    };

    jest
      .spyOn(appApiService, 'declineAccessRequest')
      .mockResolvedValue(mockResponse.status);
    jest.spyOn(component, 'removeRequest');

    component.event = { _id: eventId };
    component.declineRequest(accessRequest);

    tick(); // Simulate the passage of time until all asynchronous operations are complete

    expect(appApiService.declineAccessRequest).toHaveBeenCalledWith({
      userEmail: accessRequest.Email,
      eventId: eventId,
    });
    expect(component.removeRequest).toHaveBeenCalledWith(accessRequest);
  }));
});
