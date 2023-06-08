import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComparingeventsState } from './comparingevents.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ComparingeventsState])],
})
export class ComparingeventsModule {}
