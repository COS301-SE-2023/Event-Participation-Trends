import { Component } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'event-participation-trends-requestaccessmodal',
  templateUrl: './requestaccessmodal.component.html',
  styleUrls: ['./requestaccessmodal.component.css'],
})
export class RequestAccessModalComponent {

  handlerMessage = '';

  constructor(private modalController : ModalController, private store: Store, private readonly alertController: AlertController, private readonly toastController: ToastController) { }

  async closeAccessRequests() {
    await this.modalController.dismiss();
  }

  async sendAccessRequest(eventName: string, eventId: string) {
    const alert = await this.alertController.create({
      header: `Are you sure you want to request access to ${eventName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Access request canceled';
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = `Access request sent.`;
            this.presentToast('bottom', 'Access request sent.');
            // this.store.dispatch(new ApproveAccessRequest(userId));
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1600,
      position: position,
      color: 'success',
    });

    await toast.present();
  }
}
