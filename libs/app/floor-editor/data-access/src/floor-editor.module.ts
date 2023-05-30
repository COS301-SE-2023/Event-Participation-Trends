import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloorEditorState } from './floor-editor.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    CommonModule, NgxsModule.forFeature([FloorEditorState])
  ]
})
export class FloorEditorModule { }
