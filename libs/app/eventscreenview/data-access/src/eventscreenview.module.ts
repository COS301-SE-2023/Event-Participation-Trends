import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { EventScreenViewState } from './eventscreenview.state';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, NgxsModule.forFeature([EventScreenViewState])
  ]
})
export class EventScreenViewModule { }
