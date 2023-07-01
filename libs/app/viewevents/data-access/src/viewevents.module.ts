import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { VieweventsState } from './viewevents.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([VieweventsState])],
})
export class VieweventsModule {}
