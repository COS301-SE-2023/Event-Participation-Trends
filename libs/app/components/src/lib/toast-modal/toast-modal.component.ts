import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'event-participation-trends-toast-modal',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  templateUrl: './toast-modal.component.html',
  styleUrls: ['./toast-modal.component.css'],
  providers: [
    provideIcons({matClose})
  ],
})
export class ToastModalComponent {
  @Input() toastHeading = '';
  @Input() toastMessage = '';
  @Input() toastType = '';
  @Input() success = false;
  @Input() failure = false;
  @Input() linking = false;
  @Input() busyUploadingFloorplan = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();


  closeModal(): void {
    this.closeModalEvent.emit(true);
  }
}
