import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AddEventState } from './addevent.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AddEventState])],
})
export class AddEventModule {}
