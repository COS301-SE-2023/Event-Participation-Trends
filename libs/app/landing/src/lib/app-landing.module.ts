import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LandingComponent],
  exports: [LandingComponent]
})
export class AppLandingModule {}
