import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'event-participation-trends-toast-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-modal.component.html',
  styleUrls: ['./toast-modal.component.css'],
})
export class ToastModalComponent {
  @Input() toastMessage = '';
  @Input() toastType = '';
  @Input() success = false;
  @Input() failure = false;
  @Input() linking = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  closeModal(): void {
    this.closeModalEvent.emit(true);
  }
}
