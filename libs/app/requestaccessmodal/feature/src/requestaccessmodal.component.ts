import { Component, Input } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import {
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'event-participation-trends-requestaccessmodal',
  templateUrl: './requestaccessmodal.component.html',
  styleUrls: ['./requestaccessmodal.component.css'],
})
export class RequestAccessModalComponent {
  @Input() eventName: string | undefined;
  @Input() eventId: string | undefined;

  handlerMessage = '';

  constructor(
    private modalController: ModalController,
    private store: Store,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
    private readonly appApiService: AppApiService
  ) {}

  async closeModal() {
    await this.modalController.dismiss();
  }

  async sendAccessRequest() {
    const alert = await this.alertController.create({
      header: `Are you sure you want to request access to ${this.eventName}?`,
      cssClass: 'access-request-alert',
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
            this.requestAccess({ _id: this.eventId }); //api request
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

  requestAccess(event: any) {
    this.appApiService
      .sendViewRequest({ eventId: event._id })
      .then((status) => {
        console.log(status);
      });
  }
}
