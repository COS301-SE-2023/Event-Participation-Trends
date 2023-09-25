import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-event-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-help.component.html',
  styleUrls: ['./event-help.component.css'],
})
export class EventHelpComponent implements OnInit {

  public role = 'viewer';

  constructor(public appApiService: AppApiService) {}

  async ngOnInit() {
    this.role = await this.appApiService.getRole();
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-90');
    setTimeout(() => {
      target?.classList.remove('hover:scale-90');
    }, 100);
  }

  closeModal() {
    this.pressButton('#close-button');
    const modal = document.querySelector('#help-modal');

    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 300);
  }

}
