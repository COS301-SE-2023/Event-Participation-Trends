import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessRequestsComponent } from './accessrequests.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    component: AccessRequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessrequestsRoutingModule { }
