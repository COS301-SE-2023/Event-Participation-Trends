import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { EventDetailsState } from './event-details.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, NgxsModule.forFeature([EventDetailsState])
  ]
})
export class EventDetailsModule { }
