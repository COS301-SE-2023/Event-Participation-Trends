import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ManagerEventsState } from './managerevents.state';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, NgxsModule.forFeature([ManagerEventsState])
  ]
})
export class ManagerEventsModule { }
