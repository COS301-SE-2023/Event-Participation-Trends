import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { Router } from '@angular/router';
import { env } from 'process';

@Component({
  selector: 'event-participation-trends-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrls: ['./delete-confirm-modal.component.css'],
})
export class DeleteConfirmModalComponent {
  @Input() event_id = "";

  constructor(private appApiService: AppApiService, private router: Router) {}

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-[90%]');
    setTimeout(() => {
      target?.classList.remove('hover:scale-[90%]');
    }, 100);
  }

  deleteEvent() {
    this.pressButton('#delete_event');

    setTimeout(() => {
      this.appApiService.deleteEvent({ eventId: this.event_id });
      this.router.navigate(['/home']);
    }, 400);
  }

  closeModal() {
    const modal = document.querySelector('#delete-modal');

    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 300);
  }

}
