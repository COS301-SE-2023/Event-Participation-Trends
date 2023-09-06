import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
export class FloorplanUploadModalComponent implements AfterViewInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() uploadedFloorplan = new EventEmitter<Konva.Image>();
  @Output() uploadedFloorplanScale = new EventEmitter<number>();
  @ViewChild('previewFloorplanImage', { static: false }) previewFloorplanImage!: ElementRef<HTMLDivElement>;

  fileInput = document.getElementById('fileInput') as HTMLInputElement;
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
  canvasContainer!: Konva.Stage;
  canvas!: Konva.Layer;
  largeImage = false;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  ngAfterViewInit(): void {
    this.canvasContainer = new Konva.Stage({
      container: 'canvasImage',
      width: 556.69,
      height: 280,
    });

    this.canvas = new Konva.Layer();

    this.canvasContainer.add(this.canvas);
  }

  closeModal(): void {
    this.uploadingImage = false;
    this.uploadedImage = new Image();
    this.uploadedImage.src = '';
    this.closeModalEvent.emit(true);
  }

  closeToastModal(): void {
    this.hideModal = false;
    this.showToastUploading = false;
    this.showToastFailure = false;
    this.showToast = false;

    if (this.showToastSuccess) {
      this.showToastSuccess = false;
      this.hideModal = true;
      setTimeout(() => {
        this.showToast = true;
        this.hideModal = false;
      }, 100);
      
      this.uploadedFloorplan.emit(new Konva.Image({
        id: 'uploadedFloorplan-' + this.generateUniqueId(),
        image: this.uploadedImage,
        draggable: true,
        x: 0,
        y: 0,
        width: 1.5*this.canvasContainer.width(),
        height: 1.5*this.canvasContainer.width(),
      }));
      this.closeModalEvent.emit(true);
    }
    else if (this.showToastFailure) {
      this.showToastFailure = false;
      this.hideModal = true;
      setTimeout(() => {
        this.showToast = true;
        this.hideModal = false;
      }, 100);
    }
    this.showToastSuccess = false;
    this.showToastFailure = false;

    setTimeout(() => {
      this.showToast = true;
    }, 100);
  }

  uploadFloorplanImage(): void {

    if (this.fileInput) {
      this.fileInput.value = '';
  
      this.fileType = '';

      this.fileInput.addEventListener('change', () => {
        if (!this.fileInput || !this.fileInput.files || this.fileInput.files.length === 0) {
          return;
        }
        const selectedFile = this.fileInput.files[0];
  
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
            
            this.fileInput.value = ''; // Clear the input field
          }  
          else if (!this.fileType.startsWith('image/')) {
            this.showToast = true;
            this.showToastFailure = true; 
            this.hideModal = true;
            this.busyUploadingFloorplan = true;
            this.toastHeading = 'Invalid File Extension';
            this.toastMessage = 'Please select an image file when uploading an image of a floor plan.';
            const modal = document.querySelector('#toast-modal');

            modal?.classList.remove('hidden');
            setTimeout(() => {
              modal?.classList.remove('opacity-0');
            }, 100);
            
            this.fileInput.value = ''; // Clear the input field
          }
          else {
            this.canvas.removeChildren();
            this.uploadedImage = new Image();
            if (!this.uploadedImage) return;

            // Create a FileReader to read the selected file
            const reader = new FileReader();
            
            reader.onload = (event) => {
              if (!event || !event.target) {
                return;
              }
                this.uploadedImage.src = event.target.result as string;
                const isWideImage = this.uploadedImage.width > this.canvasContainer.width();
                const isTallImage = this.uploadedImage.height > this.canvasContainer.height();

                this.uploadedImage.onload = () => {
                  const image = new Konva.Image({
                    id: 'previewFloorplanImage',
                    image: this.uploadedImage,
                    x: 0,
                    y: 0,
                    width: 1.5*this.canvasContainer.width(),
                    height: 1.5*this.canvasContainer.height(),
                    fill: 'red',
                    cornerRadius: 10,
                  });

                  this.largeImage = false; // reset for next image

                  if (image.height() > this.canvasContainer.height() || image.width() > this.canvasContainer.width()) {
                    setTimeout(() => {
                      this.largeImage = true;
                    }, 1000);
                    image.draggable(true);

                    image.on('mousedown', () => {
                      this.canvasContainer.container().style.cursor = 'grabbing';
                    });

                    image.on('mouseup', () => {
                      this.canvasContainer.container().style.cursor = 'grab';
                    });
                    
                    //set bound on drag to check if the image's width or height is larger than the canvas
                    image.dragBoundFunc((pos) => {
                      const stageWidth = this.canvasContainer.width();
                      const stageHeight = this.canvasContainer.height();
                      const x = Math.min(0, Math.max(pos.x, stageWidth - image.width()));
                      const y = Math.min(0, Math.max(pos.y, stageHeight - image.height()));
                  
                      return { x, y };
                    });
                  }

                  this.canvas.add(image);
                  this.canvas.draw();
                  this.canvasContainer.visible(true);
                };
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

    this.fileInput?.click();
  }

  completeUpload(): void {
    this.showToastUploading = true;
    this.showToast = true;
    this.hideModal = true;
    this.busyUploadingFloorplan = true;
    this.toastHeading = 'Successfully Uploaded';
    this.toastMessage = 'Your floor plan has been successfully uploaded. It should be displayed in the top left corner of the canvas.';
    
    setTimeout(() => {
      this.showToastUploading = false;
      this.showToastSuccess = true;
      const modal = document.querySelector('#toast-modal');
      
      modal?.classList.remove('hidden');
      setTimeout(() => {
        modal?.classList.remove('opacity-0');
      }, 100);
    }, 1000);
  }

  onMouseDown(): void {    
    document.body.style.cursor = 'grabbing';
  }

  onMouseUp(): void {
    document.body.style.cursor = 'default';
  }

  generateUniqueId() : string {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNumber}`;
  }
}
