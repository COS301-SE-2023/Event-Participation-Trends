import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccessRequestsState, AccessRequestsStateModel } from '@event-participation-trends/app/accessrequests/data-access';
import { Select, Store } from '@ngxs/store';
import { ApproveAccessRequest, RejectAccessRequest } from '@event-participation-trends/app/accessrequests/util';
import { Observable } from 'rxjs';

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
  // @Select(AccessRequestsState.accessRequests) accessRequests$!: Observable<IAccessRequest[] | null>;

  constructor(private modalController : ModalController, private store: Store) { }

  async closeAccessRequests() {
    await this.modalController.dismiss();
  }

  // approveAccessRequest(userId: string) {
  //   this.store.dispatch(new ApproveAccessRequest(userId));
  // }

  // rejectAccessRequest(userId: string) {
  //   this.store.dispatch(new RejectAccessRequest(userId));
  // }

}
