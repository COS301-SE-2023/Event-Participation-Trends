import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccessRequestsState, AccessRequestsStateModel } from '@event-participation-trends/app/accessrequests/data-access';
import { Select, Store } from '@ngxs/store';
import { ApproveAccessRequest, RejectAccessRequest } from '@event-participation-trends/app/accessrequests/util';
import { Observable } from 'rxjs';
import { AlertController , ToastController } from '@ionic/angular';

interface IAccessRequest {
  userId: string;
  email: string;
  role: string;
}

@Component({
  selector: 'event-participation-trends-accessrequests',
  templateUrl: './accessrequests.component.html',
  styleUrls: ['./accessrequests.component.css'],
})
export class AccessRequestsComponent {
  @Select(AccessRequestsState.accessRequests) accessRequests$!: Observable<IAccessRequest[] | null>;
  handlerMessage = '';

  constructor(private modalController : ModalController, private store: Store, private readonly alertController: AlertController, private readonly toastController: ToastController) { }

  async closeAccessRequests() {
    await this.modalController.dismiss();
  }

  async approveAccessRequest(userId: string, userEmail: string) {
    const alert = await this.alertController.create({
      header: `Confirm granting ${userEmail} access to your event?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Unfriend canceled';
          },
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = `Granted ${userEmail} access.`;
            this.presentToast('bottom', 'Granted access to user.');
            this.store.dispatch(new ApproveAccessRequest(userId));
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

  async rejectAccessRequest(userId: string, userEmail: string) {
    const alert = await this.alertController.create({
      header: `Confirm rejecting ${userEmail}'s access request to your event?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Rejecting operation canceled';
          },
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = `Rejected access for ${userEmail}.`;
            this.presentToast('bottom', 'Rejected user access.');
            this.store.dispatch(new RejectAccessRequest(userId));
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

  }

}
