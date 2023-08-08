import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'event-participation-trends-create-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.css'],
})
export class CreateEventModalComponent {

  public name = '';

  constructor(private router: Router) {}

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-90');
    setTimeout(() => {
      target?.classList.remove('hover:scale-90');
    }, 100);
  }

  closeModal() {
    this.pressButton('#close-button');
    const modal = document.querySelector('#create-modal');

    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 300);
  }

  createEvent() {
    this.pressButton('#create-button');
    console.log(this.name);
  }

}
