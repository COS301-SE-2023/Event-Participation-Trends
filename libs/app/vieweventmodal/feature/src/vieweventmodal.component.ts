import { Component, Input } from '@angular/core';
import { ModalController, AlertController, ToastController, NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'event-participation-trends-vieweventmodal',
  templateUrl: './vieweventmodal.component.html',
  styleUrls: ['./vieweventmodal.component.css'],
})
export class ViewEventModalComponent {
  @Input() event: any | undefined;

  handlerMessage = '';

  constructor(private modalController : ModalController, private store: Store, private readonly alertController: AlertController, private readonly toastController: ToastController, private readonly navController : NavController) { }

  async closeModal() {
    await this.modalController.dismiss();
  }

  openEventDetails() {
    this.closeModal();
    this.navController.navigateForward('/eventdetails', { queryParams: {id: this.event._id, queryParamsHandling: 'merge' } });
  }

  openEventScreenView() {
    this.closeModal();
    this.navController.navigateForward('/eventscreenview', { queryParams: {id: this.event._id, queryParamsHandling: 'merge' } });
  }
}
