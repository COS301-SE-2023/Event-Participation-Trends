import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLockClosedSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'event-participation-trends-request-access-modal',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './request-access-modal.component.html',
  styleUrls: ['./request-access-modal.component.css'],
  providers: [provideIcons({ heroLockClosedSolid })],
})
export class RequestAccessModalComponent {
  @Input() event_id = "";

  constructor(private appApiService: AppApiService) {}

  sendRequest() {
    this.pressButton("#" + this.getButtonName());
    this.appApiService.sendViewRequest({ eventId: this.event_id });
    setTimeout(() => {
      this.closeModal();
    }, 300)
  }

  public setEventId(id: string) {
    this.event_id = id;
  }

  getButtonName() {
    return `request-access-${this.event_id}`;
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-90');
    setTimeout(() => {
      target?.classList.remove('hover:scale-90');
    }, 100);
  }

  getRequestModalId(event: any) {
    return `request-modal-${event._id}`;
  }

  closeModal() {
    const modal = document.querySelector('#' + this.getRequestModalId({ _id: this.event_id }));

    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 300);
  }
}
