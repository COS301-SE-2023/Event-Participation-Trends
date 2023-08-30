import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { matClose } from '@ng-icons/material-icons/baseline';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IlinkSensorRequest } from '@event-participation-trends/api/sensorlinking';
import { AppApiService } from '@event-participation-trends/app/api';
import Konva from 'konva';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';

@Component({
  selector: 'event-participation-trends-link-sensor-modal',
  standalone: true,
  imports: [CommonModule, NgIconsModule, ReactiveFormsModule, ToastModalComponent],
  templateUrl: './link-sensor-modal.component.html',
  styleUrls: ['./link-sensor-modal.component.css'],
  providers: [
    provideIcons({matClose})
  ],
})
export class LinkSensorModalComponent implements OnInit{
  @Input() activeItem!: Konva.Circle;
  @Input() customId!: string;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild('reader', {static: true}) qrCodeReader!: ElementRef;
  lightMode = false;
  hideScanner = true;
  macAddrFromQR = '';
  macAddressBlocks: string[] = [];
  macAddressBlockElements : NodeListOf<HTMLInputElement> | undefined;
  canLinkSensorWithMacAddress = false;
  macAddressForm!: FormGroup;
  inputHasFocus = false;
  showToastLinking = false;
  showToastSuccess = false;
  showToastFailure = false;
  toastMessage = '';
  toastType = '';
  toastClosed = false;

  constructor(
    private appApiService: AppApiService, private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.macAddressForm = this.formBuilder.group({
      macAddressBlock1: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock2: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock3: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock4: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock5: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
      macAddressBlock6: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
    });

    setTimeout(() => {
      this.macAddressBlockElements = document.querySelectorAll('[aria-label="MAC Address Block"]');
      
      this.macAddressBlockElements.forEach((element: HTMLInputElement) => {
        this.macAddressBlocks.push(element.value ? element.value.toString() : '');
      });
    });
  }

  get macAddressBlock1() {
    return this.macAddressForm.get('macAddressBlock1');
  }

  get macAddressBlock2() {
    return this.macAddressForm.get('macAddressBlock2');
  }

  get macAddressBlock3() {
    return this.macAddressForm.get('macAddressBlock3');
  }

  get macAddressBlock4() {
    return this.macAddressForm.get('macAddressBlock4');
  }

  get macAddressBlock5() {
    return this.macAddressForm.get('macAddressBlock5');
  }

  get macAddressBlock6() {
    return this.macAddressForm.get('macAddressBlock6');
  }

  closeModal(): void {
    //clear macAddressBlocks
    this.macAddressForm.reset();

    this.canLinkSensorWithMacAddress = false;

    this.closeModalEvent.emit(true);
  }

  closeToastModal(): void {
    this.showToastLinking = false;
    this.showToastSuccess = false;
    this.showToastFailure = false;
    this.toastClosed = true;
  }

  updateLinkedSensors() {
    const request: IlinkSensorRequest = {
      id: this.customId
    };

    const macAddress = (this.macAddrFromQR || this.macAddressBlocks.join(':')).toLowerCase();
    this.macAddrFromQR = '';
      this.appApiService.linkSensor(request, macAddress).then((res: any) => {
        if (res['success']) {          
          // this.closeModal();          
          this.showLinkingToast(true);
          // this.showSuccessToast();
        }
        else {
          this.showLinkingToast(false);
        }
      });
  }

  showSuccessToast(): void {
    this.showToastLinking = false;
    this.showToastSuccess = true;
    this.toastMessage = 'Sensor ' + this.customId + ' linked successfully!';
    this.toastType = 'success';
      
    setTimeout(() => {
      this.showToastSuccess = false;
      document.querySelector('#linkSensorModal')?.classList.add('visible');
      this.closeModal();
      this.activeItem.setAttr('fill', 'lime');
    }, 800); 
  }

  showLinkingToast(success: boolean): void {
    document.querySelector('#linkSensorModal')?.classList.add('hidden');
    this.showToastLinking = true;
    this.toastMessage = 'Linking sensor...';
    this.toastType = 'linking';
      
    setTimeout(() => {
      this.showToastLinking = false;
      if (success) {
        this.showSuccessToast();
      }
      else {
        this.showFailureToast();
      }
    }, 1500); 
  }

  showFailureToast(): void {
    this.showToastLinking = false;
    this.showToastFailure = true;
    this.toastMessage = 'Failed to link sensor with id: ' + this.customId + '. Please try again.';
    this.toastType = 'failure';
      
    setTimeout(() => {
      this.showToastFailure = false; 
      document.querySelector('#linkSensorModal')?.classList.add('visible');
      this.closeModal();
    }, 800); 
  }

  handleMacAddressInput(event: any, blockIndex: number) {
    // Format and store the value in your desired format
    // Example: Assuming you have an array called macAddressBlocks to store the individual blocks
    this.macAddressBlocks[blockIndex] = event.target.value.toString();
    // Add any additional validation or formatting logic here
    // Example: Restrict input to valid hexadecimal characters only
    const validHexCharacters = /^[0-9A-Fa-f]*$/;
    if (!validHexCharacters.test(event.target.value)) {
      // Handle invalid input, show an error message, etc.
    }

    // Move focus to the next input when 2 characters are entered, 4 characters, etc.
    if (event.target.value.length === 2 && validHexCharacters.test(event.target.value)) {
      // map thorugh the macAddressBlocksElements and find the next input
      const nextInput = this.macAddressBlockElements?.item(blockIndex + 1);
      
      if (nextInput && nextInput?.value?.toString().length !== 2) {
        nextInput.focus();

        // check if input now has focus
        if (nextInput !== document.activeElement) {
          // if not, set the focus to the next input
          nextInput.focus();
        }
      }
    }

    //check to see if all the blocks are filled nd satisfies the regex
    if (this.macAddressBlocks.every((block) => block.valueOf().length === 2 && validHexCharacters.test(block))) {
      // join the blocks together
      const macAddress = this.macAddressBlocks.join(':');
      // set the macAddress value in the form
      this.macAddressForm.get('macAddress')?.setValue(macAddress);

      this.canLinkSensorWithMacAddress = true;
    } else {
      this.canLinkSensorWithMacAddress = false;
    }
  }  

  showQRCodeScanner(): void {
      
    const reader = document.getElementById('reader');
    if (reader?.classList.contains('hidden')) {
      reader?.classList.remove('hidden');
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 15 },
      /* verbose= */ false);
    html5QrcodeScanner.render((decoded, res)=>{
      this.macAddrFromQR = decoded;
      this.updateLinkedSensors();
      if(html5QrcodeScanner.getState() == Html5QrcodeScannerState.SCANNING)
        html5QrcodeScanner.pause();
    } , undefined);

    this.hideScanner = false;
  }

  hideQRCodeScanner(): void {
    this.hideScanner = true;
    //hide div with id='reader'
    const reader = document.getElementById('reader');
    reader?.classList.add('hidden');
  }

  setInputFocus(value: boolean) {
    this.inputHasFocus = value;
  }
}
