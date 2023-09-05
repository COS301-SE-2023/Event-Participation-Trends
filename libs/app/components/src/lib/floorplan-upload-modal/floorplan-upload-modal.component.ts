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
            this.uploadedImage = new Image();
            if (!this.uploadedImage) return;

            // Create a FileReader to read the selected file
            const reader = new FileReader();
            
            reader.onload = (event) => {
              if (!event || !event.target) {
                return;
              }
                this.uploadedImage.src = event.target.result as string;

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

    fileInput?.click();
  }

  completeUpload(): void {
    this.uploadedFloorplan.emit(new Konva.Image({
      id: 'uploadedFloorplan-',
      image: this.uploadedImage,
      draggable: true,
      x: 0,
      y: 0,
    }));
  }

  onMouseDown(): void {    
    document.body.style.cursor = 'grabbing';
  }

  onMouseUp(): void {
    document.body.style.cursor = 'default';
  }
}
