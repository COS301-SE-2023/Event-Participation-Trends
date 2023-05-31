import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { FloorEditorState } from './flooreditor.state';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, NgxsModule.forFeature([FloorEditorState])
  ]
})
export class FlooreditorModule { }
