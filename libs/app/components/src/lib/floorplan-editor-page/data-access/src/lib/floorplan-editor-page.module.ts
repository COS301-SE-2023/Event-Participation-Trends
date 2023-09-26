import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { FloorPlanEditorState } from './floorplan-editor-page.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([FloorPlanEditorState])],
})
export class FloorPlanEditorModule {}