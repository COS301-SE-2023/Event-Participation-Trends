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
  @Input() event: any;

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
      header: `Are you sure you want to request access to ${this.event.Name}?`,
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
            this.requestAccess({ _id: this.event._id }); //api request
            // this.presentToastSuccess('bottom', 'Access request sent.'); // if access request is successful
            // this.presentToastFailure('bottom', 'Access request failed.'); // if access request fails

            this.closeModal();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async presentToastSuccess(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1600,
      position: position,
      color: 'success',
    });

    await toast.present();
  }

  async presentToastFailure(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1600,
      position: position,
      color: 'danger',
    });

    await toast.present();
  }

  requestAccess(event: any) {
    this.appApiService.sendViewRequest({ eventId: event._id }).subscribe((response) => {
      if (response.status === 'success') {
        this.presentToastSuccess('bottom', 'Access request sent.');
      } else {
        this.presentToastFailure('bottom', 'Access request failed. Please try again later.');
      }
    });
  }
}
