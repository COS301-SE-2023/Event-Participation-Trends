import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CompareEventsState } from './compare-events.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([CompareEventsState])],
})
export class CompareEventsModule {}
