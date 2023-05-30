import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ManagerEventsState } from './manager-events.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ManagerEventsState])]
})
export class ManagerEventsModule { }
