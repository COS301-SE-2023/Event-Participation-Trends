import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ViewEventsState } from './view-events.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ViewEventsState])],
})
export class ViewEventsModule {}
