import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { EventDetailsState } from './eventdetails.state';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, NgxsModule.forFeature([EventDetailsState])
  ]
})
export class EventdetailsModule { }
