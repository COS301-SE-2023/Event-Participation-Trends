import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'event-participation-trends-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  constructor(private readonly modalController: ModalController) {}

  closeProfile() {
    this.modalController.dismiss();
  }
}
