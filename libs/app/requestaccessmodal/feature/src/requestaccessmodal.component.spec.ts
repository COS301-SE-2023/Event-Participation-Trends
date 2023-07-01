import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestAccessModalComponent } from './requestaccessmodal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { AlertController, AngularDelegate, ModalController } from '@ionic/angular';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

describe('RequestAccessModalComponent', () => {
  let component: RequestAccessModalComponent;
  let fixture: ComponentFixture<RequestAccessModalComponent>;
  let modalController: ModalController;
    let appApiService: AppApiService;
    let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAccessModalComponent],
      imports: [NgxsModule.forRoot([]), HttpClientModule],
      providers: [ModalController, AngularDelegate, Store, AppApiService, AlertController],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    modalController = TestBed.inject(ModalController);
    appApiService = TestBed.inject(AppApiService);
    alertController = TestBed.inject(AlertController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send an access request', async () => {
    component.event = { _id: '123', Name: 'Test Event' };
    // Mock the implementation of alertController.create
    const alertSpy = jest.spyOn(alertController, 'create').mockImplementation(async () => {
        // Simulate user clicking on the "Yes" button
        component.handlerMessage = `Access request sent.`;
        component.requestAccess({ _id: component.event._id }); //api request
        component.closeModal();
  
        return Promise.resolve({
            present: () => Promise.resolve(),
            onDidDismiss: () => Promise.resolve({ role: 'confirm' }),
        } as any);
    });
    
    await component.sendAccessRequest();
    fixture.detectChanges();

    // Verify that the handlerMessage was set
    expect(component.handlerMessage).toEqual('Access request sent.');
  });
  
   
});
