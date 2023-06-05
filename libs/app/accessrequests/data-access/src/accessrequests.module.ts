import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AccessRequestsState } from './accessrequests.state';


@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AccessRequestsState])],
})
export class AccessRequestsModule {}