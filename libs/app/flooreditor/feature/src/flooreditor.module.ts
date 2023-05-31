import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorEditorRoutingModule } from './flooreditor.routing';
import { FloorEditorPage } from './flooreditor.page';
import { FloorEditorModule as FloorEditorDataAccessModule } from '@event-participation-trends/app/flooreditor/data-access';


@NgModule({
  declarations: [FloorEditorPage],
  imports: [
    CommonModule,
    FloorEditorRoutingModule,
    FloorEditorDataAccessModule
  ]
})
export class FloorEditorModule { }
