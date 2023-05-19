import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModule as ErrorDataAccessModule } from '@event-participation-trends/app/error/data-access';

@NgModule({
  imports: [
    CommonModule,
    ErrorDataAccessModule
  ]
})
export class ErrorModule { }
