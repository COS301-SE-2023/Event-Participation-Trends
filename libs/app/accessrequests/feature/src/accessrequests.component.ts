import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'event-participation-trends-accessrequests',
  templateUrl: './accessrequests.component.html',
  styleUrls: ['./accessrequests.component.css'],
})
export class AccessRequestsComponent {

  constructor(private modalController : ModalController) { }

  async closeAccessRequests() {
    await this.modalController.dismiss();
  }
}
