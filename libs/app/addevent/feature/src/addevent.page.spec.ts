import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppApiService } from '@event-participation-trends/app/api';
import { AddEventPage } from './addevent.page';
import { ICreateEventResponse } from '@event-participation-trends/api/event/util';
import { Status } from '@event-participation-trends/api/user/util';

describe('AddEventPage', () => {
  let component: AddEventPage;
  let fixture: ComponentFixture<AddEventPage>;
  let appApiService: AppApiService;
  let loadingController: LoadingController;
  let toastController: ToastController;

  beforeEach(async () => {
    const appApiMock = {
      createEvent: jest.fn(),
    };
    const loadingMock = {
      create: jest.fn(),
      present: jest.fn(),
      dismiss: jest.fn(),
    };
    const toastMock = {
      create: jest.fn(),
      present: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AddEventPage],
      imports: [ReactiveFormsModule, IonicModule, RouterTestingModule],
      providers: [
        { provide: AppApiService, useValue: appApiMock },
        { provide: LoadingController, useValue: loadingMock },
        { provide: ToastController, useValue: toastMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventPage);
    component = fixture.componentInstance;
    appApiService = TestBed.inject(AppApiService);
    loadingController = TestBed.inject(LoadingController);
    toastController = TestBed.inject(ToastController);

    component.eventForm = component.formBuilder.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventCategory: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      eventEndTime: ['', Validators.required],
    });
  });

  it('should create an event', async () => {
    // Mock the API service response
    const mockResponse: ICreateEventResponse = {
      status: Status.SUCCESS,
    };
    // appApiService.createEvent.mockReturnValue(of(mockResponse));
    jest.spyOn(appApiService, 'createEvent').mockReturnValue(of(mockResponse));

    // Mock the loading and toast instances
    const loadingInstanceMock = { present: jest.fn(), dismiss: jest.fn() };
    const toastInstanceMock = { present: jest.fn() };

    jest.spyOn(loadingController, 'create').mockReturnValue(loadingInstanceMock as any);
    jest.spyOn(toastController, 'create').mockReturnValue(toastInstanceMock as any);

    // Simulate form input
    component.eventForm.patchValue({
      eventName: 'Test Event',
      eventDate: '2023-06-26',
      eventStartTime: '09:00',
      eventEndTime: '12:00',
      eventCategory: 'Some Category',
    });

    // Simulate button click
    await component.createEvent();

    // Assert the expected behavior
    expect(appApiService.createEvent).toHaveBeenCalledWith({
      Name: 'Test Event',
      StartDate: expect.any(Date),
      EndDate: expect.any(Date),
      Location: {
        Latitude: -25.7461,
        Longitude: 28.1881,
        StreetName: 'Lynnwood Road',
        CityName: 'Pretoria',
        ProvinceName: 'Gauteng',
        CountryName: 'South Africa',
        ZIPCode: '0028',
      },
      Category: 'Some Category',
    });
    expect(loadingController.create).toHaveBeenCalledWith({
      message: 'Creating event...',
      spinner: 'circles',
    });

    expect(loadingInstanceMock.present).toHaveBeenCalled();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Event created successfully',
      duration: 2500,
      position: 'bottom',
      color: 'success',
    });
  });
});
