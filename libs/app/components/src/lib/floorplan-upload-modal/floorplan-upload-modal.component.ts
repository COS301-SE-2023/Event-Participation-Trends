import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { matClose } from '@ng-icons/material-icons/baseline';
import Konva from 'konva';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'event-participation-trends-floorplan-upload-modal',
  standalone: true,
  imports: [CommonModule, NgIconsModule, ToastModalComponent, FormsModule],
  templateUrl: './floorplan-upload-modal.component.html',
  styleUrls: ['./floorplan-upload-modal.component.css'],
  providers: [
    provideIcons({matClose})
  ],
})
export class FloorplanUploadModalComponent {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() uploadedFloorplan = new EventEmitter<Konva.Image>();
  @Output() uploadedFloorplanScale = new EventEmitter<number>();
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
  uploadingImage = false;
  alreadyUploaded = false;
  fileType = 'PNG';

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
          this.fileType = selectedFile.type;

          // test if the selected file is not more than 16MB
          if (selectedFile.size > 16000000) {
            this.showToast = true;
            this.hideModal = true;
            this.busyUploadingFloorplan = true;
            this.toastHeading = 'File Too Large';
            this.toastMessage = 'Please select a file that is less than 16MB';
            const modal = document.querySelector('#toast-modal');

            modal?.classList.remove('hidden');
            setTimeout(() => {
              modal?.classList.remove('opacity-0');
            }, 100);
            
            fileInput.value = ''; // Clear the input field
          }  
          else if (!this.fileType.startsWith('image/')) {
            this.showToast = true;
            this.hideModal = true;
            this.busyUploadingFloorplan = true;
            this.toastHeading = 'Invalid File Extension';
            this.toastMessage = 'Please select an image file when uploading an image of a floor plan.';
            const modal = document.querySelector('#toast-modal');

            modal?.classList.remove('hidden');
            setTimeout(() => {
              modal?.classList.remove('opacity-0');
            }, 100);
            
            fileInput.value = ''; // Clear the input field
          }
          else {
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

            this.uploadingImage = true;
            
            if (this.alreadyUploaded) {
              this.nothingUploaded = true; // hide previous image before it gets updated
            }

            setTimeout(() => {
              this.uploadingImage = false;
              this.nothingUploaded = false;
              this.alreadyUploaded = true;
            }, 1000);
          }
        }
      });
    }

    fileInput?.click();
  }

  completeUpload(): void {
    this.uploadedFloorplan.emit(new Konva.Image({
      image: this.uploadedImage,
      draggable: true,
      x: 0,
      y: 0,
    }));
  }
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.clientX;
    this.offsetY = event.clientY;
    const imageContainer = document.getElementById('imageContainerInner');
    
    if (imageContainer) {
      imageContainer.style.cursor = 'grabbing';
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const container = document.getElementById('imageContainerInner');
      if (!container) return;
      const img = document.getElementById('previewFloorplanImage');

      const deltaX = event.clientX - this.offsetX;
      const deltaY = event.clientY - this.offsetY;

      container.scrollLeft -= deltaX;
      container.scrollTop -= deltaY;

      this.offsetX = event.clientX;
      this.offsetY = event.clientY;
    }
  }

  onMouseUp() {
    this.isDragging = false;
    
    const imageContainer = document.getElementById('imageContainerInner');
    
    if (imageContainer) {
      imageContainer.style.cursor = 'grab';
    }
  }
}
