import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { matClose } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'event-participation-trends-floorplan-upload-modal',
  standalone: true,
  imports: [CommonModule, NgIconsModule, ToastModalComponent],
  templateUrl: './floorplan-upload-modal.component.html',
  styleUrls: ['./floorplan-upload-modal.component.css'],
  providers: [
    provideIcons({matClose})
  ],
})
export class FloorplanUploadModalComponent {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  showToastUploading = false;
  showToastSuccess = false;
  showToastFailure = false;
  showToast = true;
  hideModal = false;
  busyUploadingFloorplan = false;
  nothingUploaded = true;
  toastMessage = '';
  toastHeading = '';
  uploadedImage = new Image();

  closeModal(): void {
    this.closeModalEvent.emit(true);
  }

  closeToastModal(): void {
    this.hideModal = false;
    this.showToastUploading = false;
    this.showToastSuccess = false;
    this.showToastFailure = false;
    this.showToast = false;

    setTimeout(() => {
      this.showToast = true;
    }, 100);
  }

  uploadFloorplanImage(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          return;
        }
        const selectedFile = fileInput.files[0];
  
        if (selectedFile) {
          const fileType = selectedFile.type;
  
          if (!fileType.startsWith('image/')) {
            this.showToast = true;
            this.hideModal = true;
            this.busyUploadingFloorplan = true;
            this.toastHeading = 'Invalid File Extension';
            const modal = document.querySelector('#toast-modal');

            modal?.classList.remove('hidden');
            setTimeout(() => {
              modal?.classList.remove('opacity-0');
            }, 100);
            
            fileInput.value = ''; // Clear the input field
          }
          else {
            this.nothingUploaded = false;
            const previewImage = document.getElementById('previewFloorplanImage') as HTMLImageElement;
            if (!previewImage) return;

            // Create a FileReader to read the selected file
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Set the src attribute of the img element to the data URL of the selected image
                previewImage.setAttribute('src', event?.target?.result as string);
            };
            
            // Read the selected file as a data URL
            reader.readAsDataURL(selectedFile);
          }
        }
      });
    }

    fileInput?.click();
  }
}
