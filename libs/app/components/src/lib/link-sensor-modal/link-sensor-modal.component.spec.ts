import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LinkSensorModalComponent } from './link-sensor-modal.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';
import { AppApiService } from '@event-participation-trends/app/api';
import Konva from 'konva';

describe('LinkSensorModalComponent', () => {
  let component: LinkSensorModalComponent;
  let fixture: ComponentFixture<LinkSensorModalComponent>;
  let appApiService: AppApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSensorModalComponent, ReactiveFormsModule, NgIconsModule, HttpClientTestingModule],
      providers: [AppApiService, provideIcons({matClose})]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkSensorModalComponent);
    component = fixture.componentInstance;

    component.macAddressForm = new FormBuilder().group({
      macAddressBlock1: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock2: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock3: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock4: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock5: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock6: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
    });

    component.customId = 'sensor-1'; // Example customId value
    component.macAddrFromQR = 'AA:BB:CC:DD:EE:FF'; // Example QR_MAC_ADDRESS value
    component.macAddressBlocks = ['AA', 'BB', 'CC', 'DD', 'EE', 'FF']; // Example macAddressBlocks value

    fixture.detectChanges();

    // Inject the http service and test controller for each test
    appApiService = TestBed.inject(AppApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a valid macAddressForm', () => {
    const form: FormGroup = component.macAddressForm;
    expect(form.valid).toBeFalsy();
    
    // Set values for the form fields
    form.setValue({
      macAddressBlock1: '12',
      macAddressBlock2: '34',
      macAddressBlock3: '56',
      macAddressBlock4: '78',
      macAddressBlock5: '9A',
      macAddressBlock6: 'BC',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should reset macAddressForm and emit closeModalEvent when closeModal is called', () => {
    // Mock the necessary properties and methods
    (component.macAddressForm as any) = {
      reset: jest.fn(),
    };
  
    component.canLinkSensorWithMacAddress = true;
    (component.closeModalEvent as any) = {
      emit: jest.fn(),
    };
  
    // Call the function to be tested
    component.closeModal();
  
    // Expectations
    expect(component.macAddressForm.reset).toHaveBeenCalled();
    expect(component.canLinkSensorWithMacAddress).toBe(false);
    expect(component.closeModalEvent.emit).toHaveBeenCalledWith(true);
  });

  it('should update linked sensors and show linking toast on success', fakeAsync(() => {
    const eventSensorMac = 'aa:bb:cc:dd:ee:ff';
    component.macAddressBlocks = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff'];

    jest.spyOn(component, 'showLinkingToast').mockImplementation(() => {
      component.showToastLinking = false;
      component.showToastSuccess = true;
      component.toastMessage = 'Sensor ' + component.customId + ' linked successfully!';
      component.toastType = 'success';
        
      setTimeout(() => {
        component.showToastSuccess = false;
        document.querySelector('#linkSensorModal')?.classList.add('visible');
        component.closeModal();
      }, 800); 
    });
    component.updateLinkedSensors();

    //Expect a call to this URL
    const request = httpTestingController.expectOne(`/api/sensorlinking/${eventSensorMac}`);

    //Assert that the request is a POST.
    expect(request.request.method).toEqual('POST');

    //Respond with the data
    request.flush({success: true});

    //Call tick whic actually processes te response
    tick();

    //Run our tests
    expect(component.showLinkingToast).toHaveBeenCalledWith(true);

    //Finish test
    httpTestingController.verify();
    flush();
  }));

});
