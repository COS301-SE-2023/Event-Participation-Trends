import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { EventFullViewState } from './event-full-view.state';

@NgModule({
  imports: [
    CommonModule, NgxsModule.forFeature([EventFullViewState])
  ]
})
export class EventFullViewModule { }
