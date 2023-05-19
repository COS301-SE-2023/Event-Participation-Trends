import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ErrorsState } from './error.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ErrorsState]),
  ]
})
export class ErrorModule { }
