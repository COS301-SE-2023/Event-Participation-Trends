import { Component, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'event-participation-trends-vieweventmodal',
  templateUrl: './vieweventmodal.component.html',
  styleUrls: ['./vieweventmodal.component.css'],
})
export class ViewEventModalComponent {
  @Input() eventName: string | undefined;
  @Input() eventId: string | undefined;

  handlerMessage = '';

  constructor(private modalController : ModalController, private store: Store, private readonly alertController: AlertController, private readonly toastController: ToastController) { }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
